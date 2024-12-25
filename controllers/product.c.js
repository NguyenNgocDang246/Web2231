const productModel = require('../models/product.m');
const categoryModel = require('../models/category.m');
const brandModel = require('../models/brand.m');
const reviewModel = require('../models/review.m');
const userModel = require('../models/user.m');

module.exports = ({
    getAll: async (req, res) => {
        const categories = await categoryModel.all();
        res.render('Product', {
            user: req.session.user,
            categories: categories
        });
    },
    getOne: async (req, res, next) => {
        try {
            const id = req.params.id
            const product = await productModel.one(id);

            const categoryNames = [];
            const relatedProducts = [];
            for (const categoryId of product.category_id) {
                const category = await categoryModel.one(categoryId);
                if (category) {
                    categoryNames.push(category.name);

                    const products = await productModel.find({ category_id: category._id });
                    for (const relatedProduct of products) {
                        if (relatedProduct._id.toString() !== product._id.toString()) {
                            relatedProducts.push(relatedProduct);
                        }
                    }
                }
            }
            product.categoryNames = categoryNames;

            const brand = await brandModel.one(product.brand_id);
            product.brandNames = brand.name;

            const reviews = await reviewModel.find({ product: product._id });
            for (const review of reviews) {
                const user = await userModel.one(review.user);
                review.userName = user.name;
            }
            res.render('ProductDetails', {
                user: req.session.user,
                product: product,
                reviews: reviews,
                relatedProducts: relatedProducts.slice(0, 3)
            });
        } catch (e) {
            next(e);
        }

    },
    api: async (req, res) => {
        const { minPrice, maxPrice, category, sortBy, searchQuery, page } = req.query;

        // Tạo điều kiện tìm kiếm
        let query = {};
        if (minPrice) query.price = { $gte: +minPrice };
        if (maxPrice) query.price = { ...query.price, $lte: +maxPrice };
        if (category) {
            const categoryIDs = await categoryModel.find({ name: category });
            query.category_id = categoryIDs[0]._id;
        }
        if (searchQuery) query.name = { $regex: searchQuery, $options: 'i' };

        // Sắp xếp theo yêu cầu
        let sort = {};
        if (sortBy === 'price-low-to-high') sort.price = 1;
        if (sortBy === 'price-high-to-low') sort.price = -1;
        if (sortBy === 'newest') sort.createdAt = -1;

        // Phân trang
        const productPerPage = 3; // số lượng sản phẩm mỗi trang
        const products = await productModel.find(query, page, productPerPage, sort);

        // Phân trang
        const totalProducts = await productModel.count(query);
        const totalPages = Math.ceil(totalProducts / productPerPage);

        res.json({
            products: products,
            totalPages: totalPages,
            currentPage: +page
        });
    },
    addComment: async (req, res) => {
        const { rating, comment, productID } = req.body;
        const user = req.user;
        // Logic thêm bình luận vào sản phẩm
        const newReview = {
            product: productID,
            user: user._id,
            rating: rating,
            comment: comment,
        };
        reviewModel.add(newReview);
        res.json({ comment: { userName: user.username, rating, comment } });
    },
})