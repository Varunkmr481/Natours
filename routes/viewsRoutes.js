const express = require('express');
const viewController = require('../controllers/viewsController');
const router = express.Router();

router.route('/').get(viewController.getOverview);
// router.route('/tour').get(viewController.getTour);
router.route('/tour/:slug').get(viewController.getTour);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;