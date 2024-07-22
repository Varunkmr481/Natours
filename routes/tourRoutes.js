const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require("./../routes/reviewRoutes");

//ROUTE HANDLERS

const router = express.Router();
router.use(express.json());

// router.param('id',tourController.checkID);

// POST /tour/1234efc/reviews
// GET /tour/1234efc/reviews

router.use("/:tourId/reviews" , reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTo('admin' , 'lead-guide' , 'guide'),
  tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin' , 'lead-guide'),
    tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin' , 'lead-guide'),
    tourController.deleteTour
  );



module.exports = router;
