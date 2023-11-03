const mongoose=require('mongoose');
const reviewSchema = require('./schema/reviewSchema');

const Review=mongoose.model('Review',reviewSchema)

module.exports=Review;