const Tour = require('../models/tourModel');
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

    // 2) Build Template
    // 3) Render Template using data from 1)

    // console.log(tours);
    // console.log(req.params);

    res.status(200).render('tour',{
        title : "The Forest Hiker Tour",
        tour : tour
    })
});