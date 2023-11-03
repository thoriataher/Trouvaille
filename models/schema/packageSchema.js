const mongoose = require('mongoose');


// const itinerarySchema = new mongoose.Schema({
//   day: {
//     type: Number,

//   },
//   title: {
//     type: String,
//   },
//   description: {
//     type: String,
//   },
//   meals: {
//     breakfast: {
//       type: Boolean,
//       default: false
//     },
//     lunch: {
//       type: Boolean,
//       default: false
//     },
//     dinner: {
//       type: Boolean,
//       default: false
//     }
//   }
// });

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true
  },
  
  about: {
    type: String
  },
  TourType: {
    type: [String]
  },
  Highlights: {
    type: Number
  }, 
  Hotels: {
    type: Number
  }, 
  GuidedTour: {
    type: Number
  },
  Meals: {
    type: Number
  },
  Flights: {
    type: Number
  },
  Pricing: {
    type: Number
  },
  
  Days: {
    type: Number
  },
  // PackageItinerary: [itinerarySchema], // Array of itinerary objects
  // ratings: {
  //   type: Number,
  //   default: 4.5,
  //   min: [1, "Rating must be above 1.0"],
  //   max: [5, "Rating must be below 5.0"],
  //   set: (val) => Math.round(val * 10) / 10 // Rounds to 1 decimal place
  // },
  // price: {
  //   type: Number
  // },
  // priceDiscount: {
  //   type: Number,
  //   validate: {
  //     validator: function (val) {
  //       return val < this.price;
  //     },
  //     message: "Discount price ({VALUE}) should be below regular price"
  //   }
  // },
  imageCover: {
    type: String,
    default: 'default.jpg'
  },
  images: [String],

  description: {
    type: String,
    trim: true

  // },
  // included: [String], // Array of included items
  // notIncluded: [String], // Array of not included items
  // tripHighlights: [String], // Array of trip highlights
  // packageHotels: {
  //   standard: [{
  //     type: String,
  //     default: 'default.jpg' // Default image if no image is uploaded
  //   }],
  //   comfort: [{
  //     type: String,
  //     default: 'default.jpg'
  //   }],
  //   deluxe: [{
  //     type: String,
  //     default: 'default.jpg'
  //   }],
  //   cruise: [{
  //     type: String,
  //     default: 'default.jpg'
  //   }]
  // },
  // optionalTours: [{
  //   type: String
  // }],
  // imageCover: {
  //   type: String,
  //   default: 'default.jpg'
  },// Array of optional tours
  imageUrl: {
    type: String,
    validate: {
      validator: function (value) {
        // Regular expression to validate URL format
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(value);
      },
      message: "Invalid URL format",
    }}
});

//


module.exports=packageSchema