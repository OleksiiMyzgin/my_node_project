const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');


exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if(req.isAuthenticated()) {
        next(); // carry on! They are logged in!
        return;
    }
    req.flash('error', 'Oops! You must be logged in to do that!');
    res.redirect('/login');
};

exports.forgot = async(req, res) => {
    // 1. See if a user with that email exists
    const user = await User.findOne({ email: req.body.email});
    if(!user) {
        req.flash('error', 'NO account with that email exists'); // A password reset has been mailed to you
        return res.redirect('/login');
    }
    // 2. Set reset token ans expiry ob their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // 3. Send them an email with the token
    const resetURL = `https://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password Reset',
        resetURL, //https://localhost:7777/account/reset/0d63d7f5cd68053b26d61bdcd5101e8118b3a896
        filename: 'password-reset',
    });
    req.flash('success', `You have been emailed a password reset link.`);
    // 4. redirect to login page
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    // if there is a user, show the reset password form
    res.render('reset', { title: 'Reset your password'})
};

exports.confirmedPassword = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']) {
        next(); // keep in going
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updateUser = await user.save();
    await req.login(updateUser);
    req.flash('success', 'Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');
};