const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authControllers');

// can implement both
// 1)POST /tour/235252/reviews
// 2)POST/reviews

const router = express.Router({ mergeParams: true });

// only user should be able post reviews no admin and guide-lead
router.use(authController.protect);
router
  .route('/')
  .get(reviewsController.GetAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewsController.setTourUserIds,
    reviewsController.createReviews
  );
router.route('/:id')
.delete(authController.restrictTo('user','admin'),reviewsController.deleteReview)
.patch(authController.restrictTo('user','admin'),reviewsController.updateReview);


module.exports = router;
