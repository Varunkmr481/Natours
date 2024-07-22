const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams : true });

// POST /tour/1234efc/reviews
// GET /tour/1234efc/reviews
// POST /reviews
// GET /reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

  router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('admin','user'), reviewController.updateReview)
    .delete(authController.restrictTo('admin','user'), reviewController.deleteReview);


module.exports = router;

