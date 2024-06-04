const Tour = require("./../models/tourModel");

// Read and parse the tours data from the JSON file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/./../dev-data/data/tours-simple.json`)
//   );

exports.aliasTopTours = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,ratingAverage,price,difficulty,summary'
  
  next();
}


exports.getAllTours = async (req, res) => {

  try{
    //BUILD QUERY

    // 1.1 Basic Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page' , 'sort' , 'limit' , 'fields'];
    excludedFields.forEach(el => delete queryObj[el] );
    // console.log(req.query , queryObj);
    
    // 1.2 Advanaced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, function(match){return `$${match}`});
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }else{
      //changed -createdAt to _id due to improper pagination results
      query = query.sort('_id');  
    }

    // 3) Field Limiting
    if(req.query.fields){
      let fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    }else{
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 100 ;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error("This page does not exists!");
    }

    // 5) Aliasing
    
    //EXECUTE QUERY
    // console.log(query);
    const tours = await query;
    // console.log(tours);

    //SEND RESPONSE
    res.status(200).json({
      status: 'success', 
      requestedTime : req.requestedTime ,
      results : tours.length,
      data: {
        tours,
      }
    });
  }
  catch(err){
    res.status(404).json({
      status : 'fail',
      message : err
    })
  
  }
  };
  
  
exports.getTour = async (req, res) => {

  try{
    const tours  = await Tour.findById(req.params.id);

    console.log(req.body.id);
    res.status(200).json({
        status: 'success',
        data: {
          tours,
        },
      });
  }
  catch(err){
    res.status(400).json({
      status : 'fail',
      message : err
    })
  }
  };
  
  
exports.createTour = async (req, res) => {
    try{
      // console.log(req.body);
    
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      },
    });
    }
    catch(err){
      console.log(err);
      res.status(400).json({
        status : 'fail',
        message : 'Invalid data sent!'
      })
    }
  };
  
  
exports.updateTour = async (req, res) => {
  
  try{

    const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
        new : true ,
        runValidators : true
      });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  }catch(err){
    res.status(404).json({
      status : 'fail',
      message : err
    })
  }
  };
  
  
exports.deleteTour = async (req, res) => {

  try{

    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status : 'success',
      data : null
    })

  }catch(err){
    res.status(404).json({
      status : 'fail',
      message : err
    })
  }
  };

