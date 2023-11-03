const mongoose = require('mongoose');

const governorSchema = new mongoose.Schema({
  name: {
    type: String,
    set: (value) => value.toLowerCase() // Convert name to lowercase
  },
  
    description: {
        type: String,
        trim: true
    
      }, 
      imageCover: {
        type:String
      },
      images: [String],
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


})

module.exports=governorSchema