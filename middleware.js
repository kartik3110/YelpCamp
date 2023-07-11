const Campground = require('./models/campground')
const Review = require('./models/review')
const reviewSchema = require('./schemas')

const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        //this code runs if user tries to do something they need to be logged in for.
        //so they are redirected to /login, with original url stored in session. 
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be log in first!')
        return res.redirect('/login')
    }
    next();
}

const addReturn = (req, res, next) => {
    //middleware of POST /login. if it was a redirect to /login by isLoggedIn
    //save the returnTo from session to locals, before calling authenticate()
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id); //just for redirect
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}



// module.exports.validateReview = validateReview;
module.exports.isLoggedIn = isLoggedIn;
module.exports.addReturn = addReturn;
module.exports.isAuthor = isAuthor;
module.exports.isReviewAuthor = isReviewAuthor;
