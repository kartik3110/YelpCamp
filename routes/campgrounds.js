const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas')
const { isLoggedIn, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')// node automatically looks for an index.js
const upload = multer({ storage: storage }) //upload is a middleware

const Campground = require('../models/campground');

const expressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

const campgrounds = require('../controllers/campgrounds')


//JOI validator function
//validate() function is used to perform validation using our schema

const validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next();
    }
}


router.route('/')
    .get(campgrounds.index)
    .post(upload.single('image'), (req, res) => {
        console.log(req.body, req.file)
        res.redirect('/campgrounds');
    })
// .post(isLoggedIn, validateCamp, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, validateCamp, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.destroyCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)


module.exports = router;