const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports = {

    createReview: async (req, res, next) => {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        const newReview = await new Review(req.body.review);
        camp.reviews.push(newReview);
        newReview.author = req.user._id;
        await newReview.save();
        await camp.save();
        res.redirect(`/campgrounds/${id}`);
    },

    deleteReview: async (req, res) => {
        const { id, reviewId } = req.params;
        const camp = await Campground.findById(id);
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${id}`)

    }
}