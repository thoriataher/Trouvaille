const mongoose=require('mongoose');
const governorSchema=require('./schema/governorSchema')
const Governor=  mongoose.model('Governor',governorSchema)

module.exports=Governor