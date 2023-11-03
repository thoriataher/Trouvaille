const mongoose=require('mongoose');
const packageSchema=require('./schema/packageSchema')
const Package=  mongoose.model('User',packageSchema)

module.exports=Package