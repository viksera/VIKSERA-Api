const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/google', authController.googleLogin);

router.get('/google/callback', authController.googleCallback);

router.get('/success', authMiddleware.ensureAuthenticated, authController.loginSuccess);
router.get('/failure', authController.loginFailure);

router.get('/logout', authController.logout);

module.exports = router;
