const AppError=require('./../utils/appError')
const handleCastErrorDB= err=>{
  const message=`Invaild ${err.path}:${err.value}`
  return new AppError(message,400)
}

const handleDuplicateFieldsDB=err=>{
  
  const value=err.errmsg.match(/(["'])(\\?.)*?\1/)
  
  const message=`Duplicate field value: x. please use another value`
  return new AppError(message,400)
} 

const handleValidaionErrorDB=err=>{
  const errors=Object.values(err.errors).map(el=> el.message)
  const message=`Invail input data ..${errors.join('. ')}`
  return new AppError(message,400)
}

const handleJWTError=()=>{
  
  new  AppError('Invaild token , please log in again! ',401)
}
const handleJWTExpiredError=()=>{
  new AppError("Your token has expired ! please log in again ...",403)
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational ,trusted error :send meassge to client
  if (err.isOPerational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other unknown error:don`t leak error details for client
  } else {
    //1) log error
    console.error('ERROR 🤦‍♂️🤦‍♂️', err);
    
    // 2) send generate message
    res.status(500).json({
      status: 'erroe',
      message: 'Something went very wrong !',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error={...err};
    if(error.name==='CastError') error= handleCastErrorDB(error)
    if(error.code===11000) error=handleDuplicateFieldsDB(error)
    if(error.name==='validationError') error=handleValidaionErrorDB(error)
    if(error.name==='JsonWebTokenError') error =handleJWTErro()
     if(error.name==='TokenExpiredError') error =handleJWTExpiredError()
    
    sendErrorProd(error, res);
  }

 
};

