const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams : true });
router.use(express.json());

router.route('/').get(reviewController.getAllReviews);

// POST /tour/1234efc/reviews
// GET /tour/1234efc/reviews
// POST /reviews
// GET /reviews

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );


module.exports = router;
