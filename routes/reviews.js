const mongoose = require('mongoose');
const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas')

const Campground = require('../models/campground');
const Review = require('../models/review');

const { isLoggedIn, isReviewAuthor } = require('../middleware')

const reviews = require('../controllers/reviews')


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
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;