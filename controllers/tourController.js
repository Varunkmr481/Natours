const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,ratingAverage,price,difficulty,summary';

  next();
};

//Class for Api features

exports.getAllTours = async (req, res) => {
  try {

    //EXECUTE QUERY
    // console.log(query);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
    console.log(tours);

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedTime: req.requestedTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id);

    console.log(req.body.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // console.log(req.body);

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};


exports.getTourStats = async(req,res)=>{
  try{
    const stats = await Tour.aggregate([
      {
        $match : { ratingAverage : { $gte : 4.5 } },
      },
      {
        $group : {
          _id : { $toUpper : "$difficulty" } ,
          numTours : { $sum : 1 },
          numRatings : { $sum : "$ratingQuantity" },
          avgRating : { $avg : "$ratingAverage" },
          avgPrice : { $avg : "$price" },
          minPrice : { $min : "$price"},
          maxPrice : { $max : "$price" }
        },
      },
      {
        $sort : {
          avgPrice : 1
        }
      },
      // {
      //   $match : { _id : { $ne : "EASY"}}
      // }  
    ])

    // console.log(stats);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

  }catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getMonthlyPlan = async (req,res) =>{
  try{

    const year = req.params.year * 1 ;
    const plan = await Tour.aggregate([
      {
        $unwind : "$startDates"
      },
      {
        $match : {
          startDates : {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group : {
          _id : { $month : "$startDates" },
          numTourStarts : { $sum : 1 },
          tours : { $push : "$name" }
        }
      },
      {
        $addFields : { month : "$_id" }
      },
      {
        $project : { _id : 0 }
      },
      {
        $sort : { numTourStarts : -1 }
      },
      {
        $limit : 12 //displays only 12 docs
      }
    ]);

    res.status(200).json({
      status : 'success',
      data : plan
    })

  }catch(err){
    res.status(404).json({
      status : "fail",
      message : err
    })
  }
}