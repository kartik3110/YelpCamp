const express = require('express');
const passport = require('passport');
const router = express.Router();

const { addReturn } = require('../middleware')

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const users = require('../controllers/users')



router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))


router.route('/login')
    .get(users.renderLoginForm)
    .post(addReturn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.get('/logout', users.logOutUser)


module.exports = router;