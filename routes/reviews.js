const mongoose = require('mongoose');
const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas')

const Campground = require('../models/campground');
const Review = require('../models/review');


const expressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next();
    }
}
//reviews
//create a review
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const newReview = await new Review(req.body.review);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`);
}))

// delete review
router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)

})

module.exports = router;