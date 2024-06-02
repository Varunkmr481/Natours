const Tour = require("./../models/tourModel");

// Read and parse the tours data from the JSON file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/./../dev-data/data/tours-simple.json`)
//   );


exports.getAllTours = async (req, res) => {

  try{
    //BUILD QUERY

    // 1.1 Basic Filtering
    const queryObj = {...req.query};
    console.log(queryObj.sort.split(',').join(' '));
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
      query = query.sort('-createdAt');
    }

    //EXECUTE QUERY
    const tours = await query;

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

