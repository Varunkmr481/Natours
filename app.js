const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');

// 1) GLOBAL MIDDLEWARES

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max : 100,
  windowMS : 60 * 60 * 1000,
  message : "Too many request from this IP, Try again later in an hour!"
});

app.use("/api",limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req,res,next)=>{
//   console.log('Hello from the middleware 😎');
//   next();
// })

app.use((req,res,next)=>{
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);
  next();
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

//UNHANDLED REQUESTS
app.all('*',(req,res,next)=>{

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404 ;

  const err1 = new AppError(`Can't find ${req.originalUrl} on this server!`,404);
  // console.log(err1);
  next(err1);
})

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);
   
module.exports = app ;