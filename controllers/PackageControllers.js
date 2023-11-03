const Package=require('./../models/packageModel')
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");


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


exports.uploadPackageImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {name:'images',maxCount:3},
]);

// upload.single('image')
// upload.array('images',5)

exports.resizePackageImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `Package-${req.params.id} cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })

    .toFile(`public/img/Package${req.body.imageCover}`);


  // 2) Images
  req.body.images=[];
  await Promise.all(  req.files.images.map(async(file,i)=>{
    const filename=`Package-${req.params.id} ${i+1}.jpeg`;

    await sharp(file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/Package/${filename}`);

req.body.images.push(filename)
  }))

  next();
});

  



exports.deleteAllPackage = factory.deletALL(Package);
exports.getAllPackage  = factory.getAll(Package);
exports.getPackage  = factory.getOne(Package);
exports.deletePackage  = factory.deletOne(Package);
exports.updatePackage  = factory.UdateOne(Package);
exports.createOne = factory.createOne(Package);