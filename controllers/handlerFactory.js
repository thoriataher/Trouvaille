const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const multer = require('multer');
const { Model, model } = require('mongoose');
const upload = multer({ dest: 'uploads/' });
///////////////////////////////////////////////////
exports.deletOne= Modle=>catchAsync( async (req, res,next) => {
    const doc= await Modle.findByIdAndDelete(req.params.id);
     if(!doc){
       return next(new AppError('no docment  found with that Id',404))
      
      }
     res.status(200).send('delete Done✅✅✅');
   }

 );
 exports.deletALL= Modle=>catchAsync( async (req, res,next) => {
    const doc= await Modle.deleteMany(req.params.id)
     if(!doc){
       return next(new AppError('no docment  found with that Id',404))
      
      }
     res.status(200).send('delete Done✅✅✅');
   }
 );
 

////////////////////////////////////////////////////
exports.UdateOne=Model=>catchAsync( async (req, res,next) => {
 
    // const UpdateTour= await Tour.findByIdAndUpdate(req.params.id,req.body)
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!doc){
      return next(new AppError('no document  found with that Id',404))
     
     }
    res.status(200).json({
      status: 'success',
      data: {
        data:doc,
      },
    });
  })
/////////////////////////////////////////////////////////////
exports.createOne=Model=>  catchAsync(async (req, res,next) => {
  const doc = await Model.create(req.body);
  res.status(201).send(doc);

});
// exports.createTour=Model=>  catchAsync(async (req, res,next) => {
//   const imageData = req.file.buffer;
//   const doc = await Model.create({
//     name: req.body.name,
//     ratingsAverage:req.body.ratingsAverage,
//     image: {
//       data: imageData,
//       contentType: req.file.mimetype
//     },
//     image: {
//         data: imageData,
//         contentType: req.file.mimetype
//       },
//       price:req.body.price,
//       description:req.body.description

//   });
  
//   res.status(201).send(doc);

// });

/////////////////////////////////////////////////////////////
exports.getOne=(Model,popOptions)=>
catchAsync( async (req, res,next) => {
  let query=Model.findById(req.params.id);
  if(popOptions) query=query.populate(popOptions)
  const doc = await query
  // Tour.findOne({-id:req.params.id})
  if(!doc){
   return next(new AppError('no document  found with that Id',404))
  
  }
  res.status(203).send(doc);

});
///////////////////////////////////////////////////////
exports.getAll=Model=>
catchAsync( async (req, res,next) => {
  // To allow for nested Get reviews on tour (hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const featires = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await featires.query.explain();
   const doc = await featires.query;
  
  // send response
 res.status(200).json({
  result:doc.length,
  data:{
    doc
  }
 });

});

