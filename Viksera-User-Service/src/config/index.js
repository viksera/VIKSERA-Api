require('dotenv').config();


module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    port: process.env.PORT || 5000,
    sessionSecret: process.env.SESSION_SECRET,
};
