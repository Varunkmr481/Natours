const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req , res, next)=>{
    // 1) Get tour data from Collection
    const tours = await Tour.find();

    // 2) Build Template

    // 3) Render that template using tour data from 1)

    res.status(200).render('overview',{
        title : 'All Tours',
        tours : tours  
    });
});

exports.getTour = catchAsync(async (req,res,next)=>{
    // 1) Get the data for the requested Tour (including review and tour guides)
    const tour = await Tour.findOne({slug : req.params.slug}).populate({
        path : 'reviews',
        fields : 'review rating user'
    });
    
    // if(!tour){
    //     return next(new AppError('There is no tour with that name',404));
    // }

    // 2) Build Template
    // 3) Render Template using data from 1)

    // console.log(tours);
    // console.log(req.params);

    res.status(200).render('tour',{
        title : `${tour.name} Tour` ,
        tour : tour
    })
});

exports.getLoginForm = (req,res)=>{

    res.status(200).render('login', {
        title : 'Log into your Account'
    });
}