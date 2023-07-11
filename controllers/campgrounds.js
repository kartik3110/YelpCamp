const Campground = require('../models/campground');


module.exports = {

    index: async (req, res) => {
        const allCamps = await Campground.find({});
        res.render('campgrounds/index', { allCamps });
    },

    renderNewForm: (req, res) => {
        res.render('campgrounds/new');
    },

    createCampground: async (req, res) => {
        const newCamp = new Campground(req.body.campground);
        newCamp.author = req.user._id;
        await newCamp.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${newCamp.id}`)
    },

    showCampground: async (req, res) => {
        const id = req.params.id;
        const foundCamp = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if (!foundCamp) {
            req.flash('error', 'campground was not found');
            res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { foundCamp });
    },

    renderEditForm: async (req, res) => {
        const id = req.params.id;
        const foundCamp = await Campground.findById(id);
        if (!foundCamp) {
            req.flash('error', 'campground was not found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { foundCamp });
    },

    updateCampground: async (req, res) => {
        const id = req.params.id;
        const newCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
        req.flash('success', 'changes saved!')
        res.redirect(`/campgrounds/${newCamp.id}`)
    },

    destroyCampground: async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground!')
        res.redirect('/campgrounds');
    },


}