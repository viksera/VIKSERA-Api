const passport = require('passport');

exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/auth/failure',
}), (req, res) => {
    res.redirect('/auth/success');
};

exports.loginSuccess = (req, res) => {
    res.send({
        message: 'Login Successful',
        user: req.user,
    });
};

exports.loginFailure = (req, res) => {
    res.send({
        message: 'Login Failed',
    });
};

// Logs out the user
exports.logout = (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};
