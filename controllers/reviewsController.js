const express = require('express');
const Review = require('./../models/reviewsModel');
const factory=require('./handlerFactory')
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');


exports.setTourUserIds=(req,res,next)=>{
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

exports.GetAllReviews = factory.getAll(Review)
exports.getReviews=factory.getOne(Review)
exports.updateReview = factory.UdateOne(Review)
exports.deleteReview =factory.deletOne(Review)
exports.createReviews =factory.createOne(Review)
