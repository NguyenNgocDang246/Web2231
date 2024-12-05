const mongoose = require('mongoose');

// Định nghĩa schema cho Cart
const cartSchema = new mongoose.Schema({
    user: { type: String, required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId},
            quantity: { type: Number, required: true },
        }
    ]
});


// Tạo model từ schema
const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = ({
    all: async (page = 1, cartPerPage = null) => {
        try {
            const skip = (page - 1) * cartPerPage;
            if(cartPerPage)
            {
                const carts = await Cart.find().skip(skip).limit(cartPerPage).lean();
                return carts;
            }
            else 
            {
                const carts = await Cart.find().skip(skip).lean();
                return carts;
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
            const cart = await Cart.findById(id).lean();
            return cart;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    addItem: async (newItem, userID) => {
        try
        {
            const cart = await Cart.findOne({user: userID});
            if(cart)
            {
                const existItem = cart.items.find(item => item.product.toString() === newItem.product.toString());
                if(existItem)
                {
                    existItem.quantity += +newItem.quantity;
                    await cart.save(); // Lưu lại giỏ hàng đã cập nhật
                }
                else
                {
                    cart.items.push(newItem);
                    await cart.save();
                }
            }
            else
            {
                const newCart = new Cart({
                    user: userID,
                    items: [newItem]  
                });
                await newCart.save();
            }
        }
        catch(e)
        {
            console.error('Error:', e);
        }
        
    },
    removeItem: async (removeItem, userID) => {
        try 
        {
            const cart = await Cart.findOne({ user: userID });
            
            if (cart) {
                const itemIndex = cart.items.findIndex(item => item.product.toString() === removeItem.product.toString());
                
                if (itemIndex !== -1) {
                    
                    cart.items.splice(itemIndex, 1);

                    await cart.save();
                }
            }
        } 
        catch (e) 
        {
            console.error('Error:', e);
        }
    },
    find: async (condition = {}, page = 1, cartPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * cartPerPage;
            if(cartPerPage)
            {
                const carts = await Cart.find(condition).sort(sort).skip(skip).limit(cartPerPage).lean();
                return carts;
            }
            else 
            {
                const carts = await Cart.find(condition).sort(sort).skip(skip).lean();
                return carts;
            }    
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    findOne: async (condition) => {
        try {
            const cart = await Cart.findOne(condition).lean();
            return cart;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    },
})

