const mongoose=require('mongoose');
const PackageSchema=require('./schema/packageSchema')
const Package=  mongoose.model('Package',PackageSchema)

module.exports=Package