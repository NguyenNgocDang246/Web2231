const cartModel = require('../models/cart.m');
const userModel = require('../models/user.m');
const productModel = require('../models/product.m');

module.exports = ({
    cartDetails: async (req, res) => {
        const username = req.session.user.username;
        const user = await userModel.findOne({username: username});

        const cart = await cartModel.findOne({user: user._id});
        const products = await productModel.all();

        const cartItems = cart.items.map(item => {
            const product = products.find(product => product._id.toString() === item.product.toString());
            
            // Nếu tìm thấy sản phẩm thì thêm thông tin vào item giỏ hàng
            if (product) {
                return {
                    quantity: item.quantity,
                    name: product.name,
                    price: product.price,
                    _id: product._id
                };
            }
            
            return item;  // Nếu không tìm thấy sản phẩm, giữ nguyên item giỏ hàng
        });
        
        res.render('UserCartDetails', {cartItems});
    },
})