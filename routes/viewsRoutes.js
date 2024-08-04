const express = require('express');
const viewController = require('../controllers/viewsController');
const router = express.Router();
const authController = require('../controllers/authController');

router.use(authController.isLoggedIn);

router.route('/').get(viewController.getOverview);
router.route('/tour/:slug').get( viewController.getTour);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;