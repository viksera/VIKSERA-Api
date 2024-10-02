const express = require('express');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const config = require('./config');
const connectDB = require('./utils/database');
require('dotenv').config();

require('./services/passport'); // Initialize Passport strategies

const app = express();

// Connect to database
connectDB();

// Middleware for session handling
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
