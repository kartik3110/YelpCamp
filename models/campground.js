const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String
})

const Campground = new mongoose.model('Campground', CampgroundSchema)

module.exports = Campground;