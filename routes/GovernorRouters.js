const express = require('express');
const GovernorController=require('../controllers/governorControllers')
const router = express.Router();


router
  .route('/')
  .get(GovernorController.getAllGovernor)


  .post(GovernorController.createOne)
  // .post(GovernorController.uploadGovernorImages,GovernorController.resizeGovernorImages,GovernorController.createOne)

  .delete(GovernorController.deleteAllGovernor);  
  
  // .post(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.createTour
  // );


router
  .route('/:id')
  .get(GovernorController.getGovernor)
  .patch(GovernorController.updateGovernor)
  // .patch(GovernorController.uploadGovernorImages,GovernorController.resizeGovernorImages,GovernorController.updateGovernor)
  
  .delete(GovernorController.deleteGovernor)
  // .patch(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.updateTour
  // )

  // .delete(
  //   GovernorController.deleteAllGovernor
  // ).delete(GovernorController.getAllPackage);



module.exports = router;