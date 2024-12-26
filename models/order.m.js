const mongoose = require('mongoose');

// Định nghĩa schema cho Order
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId},
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    receiverName: { type: String, required: true },
    insurance: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending' },
    date: {type: Date, default: Date.now},
});


// Tạo model từ schema
const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = ({
    all: async (page = 1, orderPerPage = null) => {
        try {
            const skip = (page - 1) * orderPerPage;
            if(orderPerPage)
            {
                const orders = await Order.find().skip(skip).limit(orderPerPage).lean();
                return orders;
            }
            else 
            {
                const orders = await Order.find().skip(skip).lean();
                return orders;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    },
    one: async (id) => {
        try
        {
            const order = await Order.findById(id).lean();
            return order;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    add: async (newOrderObj) => {
        const newOrder = new Order(newOrderObj);
        await newOrder.save();
        return newOrder._id;
    },
    delete: async (condition) => {
        try 
        {
            await Order.deleteOne(condition);
        } 
        catch (e) 
        {
            console.error('Error:', e);
        }
    },
    find: async (condition = {}, page = 1, orderPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * orderPerPage;
            if(orderPerPage)
            {
                const orders = await Order.find(condition).sort(sort).skip(skip).limit(orderPerPage).lean();
                return orders;
            }
            else 
            {
                const orders = await Order.find(condition).sort(sort).skip(skip).lean();
                return orders;
            }    
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    findOne: async (condition) => {
        try {
            const order = await Order.findOne(condition).lean();
            return order;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    },
    update: async (condition, updateFields) => {
        try {
            const order = await Order.findOne(condition);
            if (!order) 
            {
                throw new Error('Order not found');
            }

            // Cập nhật các trường theo yêu cầu
            Object.keys(updateFields).forEach((key) => 
            {
                if (order[key] !== undefined) {
                    order[key] = updateFields[key];
                }
            });

            // Lưu lại đơn hàng sau khi cập nhật
            await order.save();
            return order;
        } catch (e) {
            console.error('Error updating order:', e);
            throw e;  // Ném lỗi để xử lý ngoài model
        }
    },
})

