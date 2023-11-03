const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory=require('./handlerFactory')
const { obj } = require('../models/schema/userSchema');

const filterObj=(obj, ...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))  newObj[el]=obj[el]
  })
  return newObj;
}
//////////////////////////////////////////////////////////
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password Updates .Please use /updateMyPassword ',
        401
      )
    );
  }
  // body.role:"admin"
  // 2) Filtered out unwanyted fildes name that are not allowed to be update 
  const filteredBody=filterObj(req.body,"name","email")
  
   
    // 3) Ubdate user document
  const updateUser = await User.findById(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  await updateUser.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    data:{
      user:updateUser
    }
  });
});
///////////////////////////////////////////////////////
exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}
//////////////////////////////////////////////////////////
exports.deleteMe= catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false})
  res.status(200).json({
    status:"success",
    data:null
  })
})
////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined! Please use /signup instead ',
  });
};
//////////////////////////////////////////////////////////

exports.getUser = factory.getOne(User)
exports.getAllUser=factory.getAll(User)

// Do Not update password with this !
exports.UpdateUser=factory.UdateOne(User)
exports.deleteUSer = factory.deletOne(User)