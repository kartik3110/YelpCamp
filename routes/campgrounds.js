const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas')

const Campground = require('../models/campground');


const expressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');


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

//all camps
router.get('/', async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', { allCamps });
})

//create
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCamp, catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCamp.id}`)
}))

//show
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const foundCamp = await Campground.findById(id).populate('reviews');
    if (!foundCamp) {
        req.flash('error', 'campground was not found');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { foundCamp });
})

//edit
router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash('error', 'campground was not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCamp });
})

router.put('/:id', validateCamp, async (req, res) => {
    const id = req.params.id;
    const newCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'changes saved!')
    res.redirect(`/campgrounds/${newCamp.id}`)
})

//delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
})

module.exports = router;