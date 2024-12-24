const cartModel = require('../models/cart.m');
const userModel = require('../models/user.m');
const productModel = require('../models/product.m');
const orderModel = require('../models/order.m');

module.exports = ({
    cartDetails: async (req, res) => {
        const username = req.user.username;
        const user = await userModel.findOne({username: username});

        const cart = await cartModel.findOne({user: user._id});
        const products = await productModel.all();

        if (!cart || !cart.items || cart.items.length === 0) 
        {
            return res.render('UserCartDetails', { cartItems: [] });
        }

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
    orderDetails: async (req, res) => {
        const type = req.query.type;
        const user = req.user;
        const orders = await orderModel.find({user: user._id});
        const products = await productModel.all();
        const productMap = products.reduce((map, product) => {
            map[product._id] = product.name;
            return map;
        }, {});

        orders.forEach(order => {
            order.items.forEach(item => {
              item.name = productMap[item.product] || 'Unknown Product'; // Thêm name hoặc giá trị mặc định
            });
        });

        const pending_orders = orders.filter(order => order.status === 'pending');
        const shipping_orders = orders.filter(order => order.status === 'shipping');
        const delivered_orders = orders.filter(order => order.status === 'delivered');

        res.render('UserOrderDetails', {type: type, pending_orders, shipping_orders, delivered_orders});
    },
    userInfo: async (req, res) => {
        let user = req.user;
        user.dob = user.dob.toISOString().split('T')[0];  // Định dạng thành yyyy-mm-dd
        res.render('UserInfo', {user});
    },
    userUpdate: async (req, res) => {
        const {name, email, dob, phone} = req.body;
        const user = req.user;
        await userModel.update({_id: user._id}, {name: name, email: email, dob: new Date(dob), phone: phone});
        
        res.send({success: true});
    }
})