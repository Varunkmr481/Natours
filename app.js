const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewsRoutes');
const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');

app.set('view engine', 'pug');
app.set('views' , path.join(__dirname , 'views'));

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname , 'public')));

// Set security http header
app.use(helmet());

// Development logging 
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// Limit requests from the same api
const limiter = rateLimit({
  max : 100,
  windowMS : 60 * 60 * 1000,
  message : "Too many request from this IP, Try again later in an hour!"
});

app.use("/api",limiter);

// Body parser , reading data from the body into req.body
app.use(express.json({
  limit : '10kb'
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS 
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);


// Test middleware 1
// app.use((req,res,next)=>{
//   console.log('Hello from the middleware 😎');
//   next();
// })

// Test middleware 2
app.use((req,res,next)=>{
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);
  next();
})

// 2) ROUTES
app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

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