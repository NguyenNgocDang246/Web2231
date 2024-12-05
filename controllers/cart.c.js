const cartModel = require('../models/cart.m');
const userModel = require('../models/user.m');

module.exports = ({
    add: async (req, res) => {
        const { productId, quantity } = req.body;
        const username = req.session.user.username;
        const user = await userModel.findOne({username: username}); 
        // Logic xử lý thêm sản phẩm vào giỏ hàng
        const newItem = {
            product: productId,
            quantity: quantity
        }
        await cartModel.addItem(newItem, user._id);
        res.json({ message: 'Product added to cart successfully!' });
    },
    remove: async (req, res) => {
        const { productId } = req.body;
        const username = req.session.user.username;
        const user = await userModel.findOne({username: username});
        const removeItem = {
            product: productId,
        }
        await cartModel.removeItem(removeItem, user._id);
        res.json({ message: 'Product delete successfully!' });
    }
})