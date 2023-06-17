const mongoose = require('mongoose');
const express = require('express');
const { campgroundSchema } = require('./schemas')
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Campground = require('./models/campground');
const expressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.send('this is the root page');
})

//validator function

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
app.get('/campgrounds', async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', { allCamps });
})

//create
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCamp, catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`)
}))

//show
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show', { foundCamp });
})

//edit
app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
})

app.put('/campgrounds/:id', validateCamp, async (req, res) => {
    const id = req.params.id;
    const newCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${newCamp.id}`)
})

//delete
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

//error handlers

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'something went wrong (unknown error)';
    }
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('server running at port 3000');
})