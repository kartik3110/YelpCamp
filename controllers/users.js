const User = require('../models/user');
module.exports = {

    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, () => {
                req.flash('success', 'sucessfully registered!');
                res.redirect('/campgrounds')
            })
        }
        catch (e) {
            req.flash('error', e.message);
            res.redirect('/register')
        }
    },

    renderRegisterForm: (req, res) => {
        res.render('users/register');
    },

    renderLoginForm: (req, res) => {
        res.render('users/login')
    },

    loginUser: (req, res) => {

        //addReturn middleware stored the return address in locals.
        const returnUrl = res.locals.returnTo || '/campgrounds';
        req.flash('success', 'logged in successfully');
        res.redirect(returnUrl)
    },

    logOutUser: (req, res) => {
        req.logOut((e) => {
            if (e) return next(e);
            req.flash('success', 'logged Out')
            res.redirect('/campgrounds')
        });
    }


}