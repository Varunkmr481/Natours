const AppError = require("../utils/appError");

const handleJwtTokenExpiredError = (err) => {
  message = 'Your token has expired . Please Login again !';
  return new AppError(message,401);
}

const handleJWTError = (err) => {
  const message = "Invalid Token ! Please login again !";
  return new AppError(message,401);
}

const handleCastErrorDB = (err) =>{
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message,400)
}

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value : ${err.keyValue.name}. Please use another value!`
  return new AppError(message,400);
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message,400);
}

const sendErrorDev = (err, req, res) => {
  // A) For API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  
  // B) For Rendered Website
  console.log('Error : ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went Wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // 1) Operational , trusted errors : send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // 2) Programming or any unknown error : don't leak error details
    // Log error
    console.log('Error : ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !',
    });
  }

  // B) RENDERED WEBSITE
  // 1) Operational , trusted errors : send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went Wrong!',
      msg: err.message,
    });
  }
  // 2) Programming or any unknown error : don't leak error details

  // Log error
  console.log('Error : ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went Wrong!',
    msg: 'Please Try Again Later!',
  });
};

module.exports = (err,req,res,next)=>{

    err.statusCode =  err.statusCode || 500 ;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
      sendErrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV === 'production'){
      let error = {...err};
      error.name = err.name;
      error.message = err.message;

      if(error.name === 'CastError'){
        error = handleCastErrorDB(error);
      }

      if(error.code === 11000){
        error = handleDuplicateFieldsDB(error);
      }

      if(error.name === "ValidationError"){
        error = handleValidationErrorDB(error);
      }

      if(error.name === 'JsonWebTokenError'){
        error = handleJWTError(error)
      }

      if(error.name === 'TokenExpiredError'){
        error = handleJwtTokenExpiredError(error);
      }

      sendErrorProd(error,req,res);
    }
    }
