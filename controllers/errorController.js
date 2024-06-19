const sendErrorDev = (res,err) => {
  res.status(err.statusCode).json({
    status : err.status,
    message : err.message,
    error : err , 
    stack : err.stack
  })
}

//operational , trusted errors : send message to client
const sendErrorProd = (res,err) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status : err.status,
      message : err.message
    })
  }

  //programming or any unknown error : don't leak error details
  else{
    // 1) Log error
    console.log('Error : ' , err);

    res.status(500).json({
      status : 'error' ,
      message : 'Something went very wrong !'
    })
  }
}

module.exports = (err,req,res,next)=>{

    err.statusCode =  err.statusCode || 500 ;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
      sendErrorDev(res,err);
    }
    else if(process.env.NODE_ENV === 'production'){
      sendErrorProd(res,err);
    }
    }
