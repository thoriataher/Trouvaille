const Tour = require("../models/tourModel");
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


exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {name:'images',maxCount:3},
]);

// upload.single('image')
// upload.array('images',5)

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id} cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })

    .toFile(`public/img/tours${req.body.imageCover}`);


  // 2) Images
  req.body.images=[];
  await Promise.all(  req.files.images.map(async(file,i)=>{
    const filename=`tour-${req.params.id} ${i+1}.jpeg`;

    await sharp(file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${filename}`);

req.body.images.push(filename)
  }))

  next();
});

  



///////////////////////////////////////////////////////////////////
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,description,";
  next();
};

///////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteAllTour = factory.deletALL(Tour);
exports.getAllTour = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.deleteTour = factory.deletOne(Tour);
exports.updateTour = factory.UdateOne(Tour);
exports.createOne = factory.createOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$price" },
        //  _id:'$ratingsAverage',
        // _id:'$difficulty',
        numRating: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avePrice: { $avg: "$price" },
        minPricde: { $min: "$price" },
        maxPricde: { $max: "$price" },
      },
    },
    {
      $sort: { avePrice: 1 },
    },
    // {
    //   $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
