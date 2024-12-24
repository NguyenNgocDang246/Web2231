const cartModel = require('../models/cart.m');
const userModel = require('../models/user.m');

module.exports = ({
    add: async (req, res, next) => {
        try {
            const { productId, quantity } = req.body;
            if (req.session.user?.type === 'guest') {
                if (!req.session.user.cart) {
                    req.session.user.cart = [];
                }
                const existingProductIndex = req.session.user.cart.findIndex(item => item.product === productId);

                if (existingProductIndex !== -1) {
                    // Nếu sản phẩm đã tồn tại, cập nhật quantity
                    req.session.user.cart[existingProductIndex].quantity += quantity;
                } else {
                    // Nếu chưa tồn tại, thêm mới sản phẩm vào giỏ hàng
                    req.session.user.cart.push({
                        product: productId,
                        quantity: quantity
                    });
                }
            }
            else {
                const username = req.user.username;
                const user = await userModel.findOne({ username: username });
                // Logic xử lý thêm sản phẩm vào giỏ hàng
                const newItem = {
                    product: productId,
                    quantity: quantity
                }
                await cartModel.addItem(newItem, user._id);
            }

            res.json({ message: 'Product added to cart successfully!' });
        } catch (e) {
            next(e);
        }
    },
    remove: async (req, res, next) => {
        try {
            const { productId } = req.body;
            if(req.session.user?.type === 'guest') {
                const existingProductIndex = req.session.user.cart.findIndex(item => item.product === productId);
                if (existingProductIndex !== -1) {
                    req.session.user.cart.splice(existingProductIndex, 1);
                }
            }
            else
            {
                const username = req.user.username;
                const user = await userModel.findOne({ username: username });
                const removeItem = {
                    product: productId,
                }
                await cartModel.removeItem(removeItem, user._id);
            }
            res.json({ message: 'Product delete successfully!' });
        } catch (e) {
            next(e);
        }
    }
})