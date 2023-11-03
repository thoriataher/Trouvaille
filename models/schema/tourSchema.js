const mongoose = require("mongoose");
const slugify = require("slugify");

const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "A tour must have a name  "],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equle 40 characters"],
      minlength: [5, "A tour name must have more or equle 10 characters"],
      // validate:[validator.isAlpha,'Tour name most only contain char']
    },

    imageUrl: {
      type: String,
      validate: {
        validator: function (value) {
          // Regular expression to validate URL format
          const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
          return urlRegex.test(value);
        },
        message: "Invalid URL format",
      },
    },
    slug: String,

    ratings: {
      type: Number,
      default: 4.5,
      min: [1, " Rating must be above 1.0"],
      max: [5, " Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, //4.666666666  46.6666666  , 47,   4.7
    },

    price: {
      type: Number,
      // required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below reqular price ",
      },
    },

    imageCover: {
      type:String
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      // required: true,
    }, 
     title: {
      type: String,

    },about:{
      type:String,
      trim:true,

    } ,
    governor: {

        type: String,
        set: (value) => value.toLowerCase() // Convert name to lowercase
      
      


    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1 });
tourSchema.index({ slug: 1 });

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id ",
});
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = tourSchema;
