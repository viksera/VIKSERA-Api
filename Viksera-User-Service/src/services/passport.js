const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: config.callbackURL,
}, (accessToken, refreshToken, profile, done) => {
    
    User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        } else {
            new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
            }).save().then(user => done(null, user));
        }
    });
}));
