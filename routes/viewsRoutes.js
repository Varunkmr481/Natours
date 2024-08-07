const express = require('express');
const viewController = require('../controllers/viewsController');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/').get(authController.isLoggedIn, viewController.getOverview);
router.route('/tour/:slug').get(authController.isLoggedIn, viewController.getTour);
router.route('/login').get(authController.isLoggedIn, viewController.getLoginForm);
router.route('/me').get(authController.protect, viewController.getAccount);

module.exports = router;