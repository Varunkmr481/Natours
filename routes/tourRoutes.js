const express = require('express');
const tourController = require('../controllers/tourController');


//ROUTE HANDLERS  

const router = express.Router();
router.use(express.json());

// router.param('id',tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;