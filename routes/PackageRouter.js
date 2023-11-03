const express = require('express');
const PackageController=require('../controllers/PackageControllers')
const router = express.Router();


router
  .route('/')
  .get(PackageController.getAllPackage)

  .post(PackageController.createOne
  ); 
  // .post(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.createTour
  // );


router
  .route('/:id')
  .get(PackageController.getPackage)
  .patch(PackageController.updatePackage)
  //  .patch(PackageController.uploadPackageImages,PackageController.resizePackageImages,PackageController.updatePackage)
  
  // .patch(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.updateTour
  // )
  // .delete(
  //   tourController.deleteTour
  // )
  .delete(
    PackageController.deletePackage
  ).delete(PackageController.getAllPackage);



module.exports = router;