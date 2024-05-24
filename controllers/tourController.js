const fs = require('fs');

// Read and parse the tours data from the JSON file.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/./../dev-data/data/tours-simple.json`)
  );

exports.checkID = (req,res,next,val) => {
  console.log(`The value of id : ${val}`);

  // id ---> req.params.id (String)
  const id = val *1;   

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID given!',
    });
  }
  next();
}

exports.checkBody = (req,res,next)=>{
  // console.log(req.body);
  
  // const {name , price} = req.body;
  // console.log(name);

  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status : 'fail',
      message : "name and price are required fields"
    })
  }

  next();
}


exports.getAllTours = (req, res) => {
    console.log(req.requestedTime);
  
    res.status(200).json({
      status: 'success',
      requestedTime : req.requestedTime ,
      data: {
        tours,
      },
    });
  };
  
  
exports.getTour = (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    const tour = tours.find((el) => el.id == id);
    // console.log(tour);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  };
  
  
exports.createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
  
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    );
  };
  
  
exports.updateTour = (req, res) => {
  
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<Updated tour....>',
      },
    });
  };
  
  
exports.deleteTour = (req, res) => {

    res.status(204).json({
      status: 'success',
      data: null,
    });
  };

