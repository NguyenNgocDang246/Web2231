const mongoose = require('mongoose');

// Định nghĩa schema cho User
const brandSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Brand = mongoose.model('Brand', brandSchema, 'brands');

module.exports = ({
    all: async (page = 1, brandPerPage = null) => {
        try {
            const skip = (page - 1) * brandPerPage;
            if(brandPerPage)
            {
                const brands = await Brand.find().skip(skip).limit(brandPerPage).lean();
                return brands;
            }
            else 
            {
                const brands = await Brand.find().skip(skip).lean();
                return brands;
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
            const brand = await Brand.findById(id).lean();
            return brand;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    }
})

