const mongoose = require('mongoose');

// Định nghĩa schema cho User
const productSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Product = mongoose.model('Product', productSchema, 'products');

module.exports = ({
    all: async (page = 1, productPerPage = null) => {
        try {
            if(productPerPage)
            {
                const skip = (page - 1) * productsPerPage;
                const products = await Product.find().skip(skip).limit(productPerPage).lean();
                return products;
            }
            else 
            {
                const products = await Product.find().skip(page - 1).lean();
                return products;
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
            if(!mongoose.Types.ObjectId.isValid(id))
                throw new Error('Invalid product id');

            const product = await Product.findById(id).lean();

            if(!product) throw new Error('Product not found');
            return product;
        }
        catch(e)
        {
            throw(e);
        }
        
    },
    newest: async (limit) => {
        try{
            const products = await Product.find().sort({ createdAt: -1 }).limit(limit).lean();
            return products;
        }
        catch(e)
        {
            throw(e);
        }
    },
    bestselling: async (limit) => {
        const orderModel = require('../models/order.m');  
        try{
            const orders = await orderModel.all();
            const productQuantityMap = orders.reduce((map, order) => {
                order.items.forEach(item => {
                    map[item.product] = (map[item.product] || 0) + item.quantity;
                });
                return map;
            }, {});
            const sortedProductIds = Object.entries(productQuantityMap)
                .sort((a, b) => b[1] - a[1])  
                .slice(0, limit)
                .map(entry => entry[0]);

            const products = await Product.find({ _id: { $in: sortedProductIds } }).lean();
            return products;
        }
        catch(e)
        {
            throw(e);
        }
    },
    find: async (condition = {}, page = 1, productPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * productPerPage;
            if(productPerPage)
            {
                const products = await Product.find(condition).sort(sort).skip(skip).limit(productPerPage).lean();
                return products;
            }
            else 
            {
                const products = await Product.find(condition).sort(sort).skip(skip).lean();
                return products;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    count: async (condition) => {
        return await Product.countDocuments(condition);
    }
})

