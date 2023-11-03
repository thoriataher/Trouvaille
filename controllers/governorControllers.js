const Governor=require('./../models/governorModels')
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
//////////////////////////////////////////////////////////////////////////////////////////////////
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image! please upload inly images ", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


exports.uploadGovernorImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {name:'images',maxCount:3},
]);

// upload.single('image')
// upload.array('images',5)

exports.resizeGovernorImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `Governor-${req.params.id} Governor.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })

    .toFile(`public/img/Governor${req.body.imageCover}`);


  // 2) Images
  req.body.images=[];
  await Promise.all(  req.files.images.map(async(file,i)=>{
    const filename=`Governor-${req.params.id} ${i+1}.jpeg`;

    await sharp(file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/Governor/${filename}`);

req.body.images.push(filename)
  }))

  next();
});

  

exports.deleteAllGovernor= factory.deletALL(Governor);
exports.getAllGovernor  = factory.getAll(Governor);
exports.getGovernor  = factory.getOne(Governor);
exports.deleteGovernor  = factory.deletOne(Governor);
exports.updateGovernor = factory.UdateOne(Governor);
exports.createOne = factory.createOne(Governor);