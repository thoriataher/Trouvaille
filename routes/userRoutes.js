const express = require('express');
const userController = require('../controllers/userControllers');
const {
  getAllUser,
  createUser,
  getUser,
  UpdateUser,
  deleteUSer,
} = require('../controllers/userControllers');

const authControllers = require('./../controllers/authControllers');
const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

// Protect all routes after this middleware 
router.use(authControllers.protect)

router.patch(
  '/updateMyPassword',
  authControllers.updatePassword
);
router.get(
  '/me',
  userController.getMe,
  userController.getUser
);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', authControllers.protect, userController.deleteMe);


router.use(authControllers.restrictTo('admin'))

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.deleteUSer);

module.exports = router;
