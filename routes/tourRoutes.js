const express = require('express');
const tourController = require('../controllers/tourContollers');
const authController = require('./../controllers/authControllers');
// const {getAllTour,createTour,getTour,UpdateTour,deleteTour}=require('../controllers/tourContollers')
// const reviewController = require('./../controllers/reviewsController');
const reviewRouter = require('./../routes/reviewRouter');
const router = express.Router();
// post /tour/235252/reviews
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);


router
  .route('/')
  .get(tourController.getAllTour)

  .post(tourController.createOne
  ); 
  // .post(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.createTour
  // );

router
  .route('/:id')
  .get(tourController.getTour)

  .patch(tourController.updateTour)
//  .patch(tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour)

  // .patch(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.updateTour
  // )
  // .delete(
  //   tourController.deleteTour
  // )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  ).delete(tourController.deleteAllTour);

module.exports = router;
