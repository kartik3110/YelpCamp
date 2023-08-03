const mongoose = require('mongoose');
const Review = require('./review');

const { ref } = require('joi');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry:
    {
        type:
        {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:
        {
            type: [Number],
            required: true
        }
    },
    images: [
        {
            url: String,
            fileName: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

const Campground = new mongoose.model('Campground', CampgroundSchema)


module.exports = Campground;