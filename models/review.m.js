const mongoose = require('mongoose');

// Định nghĩa schema cho User
const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, required: true},
    rating: { type: Number, required: true},
    comment: { type: String, required: true},
});


// Tạo model từ schema
const Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = ({
    all: async (page = 1, reviewPerPage = null) => {
        try {
            const skip = (page - 1) * reviewPerPage;
            if(reviewPerPage)
            {
                const reviews = await Review.find().skip(skip).limit(reviewPerPage).lean();
                return reviews;
            }
            else 
            {
                const reviews = await Review.find().skip(skip).lean();
                return reviews;
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
            const review = await Review.findById(id).lean();
            return review;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    find: async (condition = {}, page = 1, reviewPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * reviewPerPage;
            if(reviewPerPage)
            {
                const reviews = await Review.find(condition).sort(sort).skip(skip).limit(reviewPerPage).lean();
                return reviews;
            }
            else 
            {
                const reviews = await Review.find(condition).sort(sort).skip(skip).lean();
                return reviews;
            }    
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    add: async (newReviewObj) => {
        const newReview = new Review(newReviewObj);
        await newReview.save();
    }
})

