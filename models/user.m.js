const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'normal_user' },
});


// Tạo model từ schema
const User = mongoose.model('User', userSchema, 'users');

module.exports = ({
    all: async (page = 1, userPerPage = null) => {
        try {
            const skip = (page - 1) * userPerPage;
            if(userPerPage)
            {
                const users = await User.find().skip(skip).limit(userPerPage).lean();
                return users;
            }
            else 
            {
                const users = await User.find().skip(skip).lean();
                return users;
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
            const user = await User.findById(id).lean();
            return user;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    add: async (newUserObj) => {
        const newUser = new User(newUserObj);
        await newUser.save();
    },
    find: async (condition = {}, page = 1, userPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * userPerPage;
            if(userPerPage)
            {
                const users = await User.find(condition).sort(sort).skip(skip).limit(userPerPage).lean();
                return users;
            }
            else 
            {
                const users = await User.find(condition).sort(sort).skip(skip).lean();
                return users;
            }    
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    findOne: async (condition) => {
        try {
            const user = await User.findOne(condition).lean();
            return user;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    },
})

