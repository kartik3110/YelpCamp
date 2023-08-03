const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports = {

    index: async (req, res) => {
        const allCamps = await Campground.find({});
        res.render('campgrounds/index', { allCamps });
    },

    renderNewForm: (req, res) => {
        res.render('campgrounds/new');
    },

    createCampground: async (req, res) => {

        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
        req.body.campground.geometry = geoData.body.features[0].geometry;// looks like {type: "point", coordinates:[23,43]}
        const newCamp = new Campground(req.body.campground);
        //add images
        newCamp.images = req.files.map(el => ({ url: el.path, fileName: el.filename }));//empty array if no images provided
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
        console.log(req.body, req.files)
        const newCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
        //has req.files me new files.
        let newImagesArray = req.files.map(el => ({ url: el.path, fileName: el.filename }));
        newCamp.images.push(...newImagesArray);
        await newCamp.save();
        if (req.body.deleteImageArray) {
            //deleting from cloudinary
            for (let filename of req.body.deleteImageArray) {
                await cloudinary.uploader.destroy(filename);
            }
            //The $pull operator removes from an existing array(in mongo) all instances of a value or values that match a specified condition.
            await newCamp.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImageArray } } } });
            await newCamp.save();
            console.log(newCamp)
        }
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