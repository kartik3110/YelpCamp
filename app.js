const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const expressError = require('./utils/expressError');

//JOI const { campgroundSchema, reviewSchema } = require('./schemas')
// const Campground = require('./models/campground');
// const Review = require('./models/review');
// const catchAsync = require('./utils/catchAsync');
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionOptions = {
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionOptions))
app.use(flash())

//middleware for sending flash messages

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.get('/', (req, res) => {
    res.send('this is the root page');
})

// routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

//error handlers

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found hit the last handler', 404))
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