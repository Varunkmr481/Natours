const fs = require('fs');

// Read and parse the tours data from the JSON file.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );


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
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id == id);
    // console.log(tour);
  
    if (tours.length < id) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid Id',
      });
    }
  
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
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID given!',
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<Updated tour....>',
      },
    });
  };
  
  
exports.deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID given!',
      });
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
  };

