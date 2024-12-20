const orderModel = require('../models/order.m');
const userModel = require('../models/user.m');
const cartModel = require('../models/cart.m');
const { model } = require('mongoose');

module.exports = ({
    request: async (req, res) => {
        const username = req.user.username;
        const user = await userModel.findOne({ username: username });

        if (!req.body.selectedItems || !req.body.receiverName || !req.body.address) {
            return res.status(400).json({ success: false, message: "Invalid request data" });
        }

        const newOrder = {
            user: user._id,
            items: req.body.selectedItems,
            receiverName: req.body.receiverName,
            shippingAddress: req.body.address,
            paymentMethod: req.body.paymentMethod,
            insurance: req.body.insurance,
            totalAmount: +(req.body.totalAmount) + (req.body.insurance === 'yes'? 1000: 0),
        };
        const orderID = await orderModel.add(newOrder);

        try {
            const cart = await cartModel.findOne({ user: user._id });
            if (cart) 
            {
                for (let orderItem of newOrder.items) 
                {
                    await cartModel.removeItem({ product: orderItem.product }, user._id);
                }
            }
        } 
        catch (e) 
        {
            console.error("Error clearing cart items:", e);
            return res.status(500).json({ success: false, message: "Failed to clear cart items" });
        }
        const isPaymentOnline = req.body.paymentMethod === 'online';

        res.json({ success: true, href: '/checkout/confirm', orderID: orderID, isPaymentOnline });
    },
    renderConfirm: async (req, res) => {
        const orderID = req.query.orderID;
        const isPaymentOnline = req.query.isPaymentOnline === 'true'? true : false;
    
        const order = await orderModel.findOne({_id: orderID});

        res.render('checkoutConfirm', { order, isPaymentOnline });
    },
    getToken: async (req, res) => {
        // logic gửi yêu cầu thanh toán qua hệ thống thanh toán
        // nhận về token thanh toán, gửi token qua client
        const token = '123456789012345678901234567890';
        res.json({ success: true, token });
    },
    confirm: async (req, res) => {

        const username = req.user.username;
        const user = await userModel.findOne({ username: username });

        const isCancel = req.body.isCancel;
        if(isCancel === 'true')
        {
            const deleteOrder = await orderModel.findOne({_id: req.body.orderID});
            // thêm lại về giỏ hàng
            const cart = await cartModel.findOne({ user: user._id });
            if (cart) 
            {
                for (let orderItem of deleteOrder.items) 
                {
                    await cartModel.addItem(orderItem, user._id);
                }
            }
            await orderModel.delete({_id: req.body.orderID});

            res.redirect('/user/cart_details');
            return;
        }
    
        const token = req.body.token;
        const order = await orderModel.findOne({_id: req.body.orderID}); // để lấy order.totalAmount
        // gửi user_id, và token qua hệ thống thanh toán
        // nhận kết quả
        const result = true;
        if (result) {
            const orderID = req.body.orderID;
            await orderModel.update({_id: orderID}, {'paymentStatus': 'paid'});
            res.json({ success: true });
        }
        else {
            const deleteOrder = await orderModel.findOne({_id: req.body.orderID});
            // thêm lại về giỏ hàng
            const cart = await cartModel.findOne({ user: user._id });
            if (cart) 
            {
                for (let orderItem of deleteOrder.items) 
                {
                    await cartModel.addItem(orderItem, user._id);
                }
            }
            await orderModel.delete({_id: req.body.orderID});
            res.json({ success: false });
        }

    }
})