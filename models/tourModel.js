const mongoose=require('mongoose');
const tourSchema=require('./schema/tourSchema')

// the name model is caiptal 
const Tour=mongoose.model('Tour',tourSchema)

module.exports=Tour