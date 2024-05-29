const Tour = require("./../models/tourModel");

// Read and parse the tours data from the JSON file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/./../dev-data/data/tours-simple.json`)
//   );


exports.getAllTours = async (req, res) => {

  try{
    console.log(req.requestedTime);

    const tours = await Tour.find();

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

