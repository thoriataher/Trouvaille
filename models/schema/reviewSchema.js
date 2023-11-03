const mongoose = require('mongoose');
const Tour = require('./../tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty ! '],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1.0,
      max: 5.0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour .'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({tour:1 , user:1},{unique:true})

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name city',
  });
  next();
});


reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
 
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].nRating,
    ratingsQuantity: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  // this points to current review

  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findByIdAnd/,async function(next){
  const r=await this.findOne();

  next()
});

reviewSchema.post(/^findByIdAnd/,async function(next){
 
  // await this.findOne(); does NOT work here,query has already executed 


  await this.r.constructor.calcAverageRatings(this.r.tour)
  next()
});



module.exports = reviewSchema;
