const mongoose = require('mongoose');
const slugify = require('slugify');

const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name  '],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equle 40 characters'],
      minlength: [10, 'A tour name must have more or equle 10 characters'],
      // validate:[validator.isAlpha,'Tour name most only contain char']
    },
    image: {
      data: Buffer,
      contentType: String
    },
    slug: String,
    duration: {
      type: Number,
      select: false,
    },
  
    difficulty: {
      type: String,
     
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy, medium, difficult ',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, ' Rating must be above 1.0'],
      max: [5, ' Rating must be below 5.0'],
      set:val=>Math.round(val *10 ) /10 //4.666666666  46.6666666  , 47,   4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below reqular price ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    
    srartDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // Embedded
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Piont',
        enum: ['Piont'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: 'Piont',
          enum: ['Piont'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({price:1})
tourSchema.index({slug:1})
tourSchema.index({startLocation:'2dsphere'})
tourSchema.index({geoNear:'2dsphere'})


tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// Document  middleware :run before .save() and .create() .insertMany
// tourSchema.pre('save',async function(next){
// const guidesPromises= this.guides.map(async id=>await User.findById(id))
// this.guides=await Promise.all(guidesPromises)
//  next()
// })


// Virtual populate 
tourSchema.virtual('reviews',{
  ref:"Review",
  foreignField:'tour',
  localField:"_id "

})
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save',function(next){
//   console.log('will save document....');
//   next();
// })

// tourSchema.post('save',function(doc,next){
// console.log(doc);
// next();
// }
// )

// QUERY MIDDLEWARE

// tourSchema.pre('find',function(next){  //get tour

tourSchema.pre(/^find/, function (next) {
  // any regular expression start with 'find'
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/,function (next){
  
  this.populate({
    path: 'guides',
   select:'-__v -passwordChangedAt'
   });
  next()
})

// tourSchema.post(/^find/,function (next){
// console.log(`Query took ${Date.now()-this.start}`)

// next();
// })

// AGGREATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this);
//   next();
// });

module.exports = tourSchema;
