const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) {
    return next(new AppError('There is problem getting all the review!', 400));
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
        reviews
    },
  });
});

exports.createReview = catchAsync(async (req,res,next)=>{
    const newReview = await Review.create(req.body);
    if(!newReview){
        return next(new AppError("The review not created due to some problem",400));
    }
    
    res.status(200).json({
        status : "success",
        data : {
            review : newReview
        }
    });
});

