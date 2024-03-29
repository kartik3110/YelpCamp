const mongoose = require('mongoose');
const Review = require('./review');

const { ref } = require('joi');

const Schema = mongoose.Schema;


const ImageSchema = new Schema({        //made different schema just to add virtual property of thumbnail
    url: String,
    fileName: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('upload', 'upload/w_200')
})
const opts = { toJSON: { virtuals: true } };
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
    images: [ImageSchema],
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
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    // return "<h5>hleo</h5>"
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`

    //when \\" will make so that the quotations will not get passed during JSON.parse, and will be kept as is.
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

const Campground = new mongoose.model('Campground', CampgroundSchema)


module.exports = Campground;