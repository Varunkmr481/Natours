const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse incoming JSON requests.
app.use(express.json());

// Read and parse the tours data from the JSON file.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
};


const getTour = (req, res) => {
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


const createTour = (req, res) => {
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


const updateTour = (req, res) => {
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


const deleteTour = (req, res) => {
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


// Define a route for GET requests to '/api/v1/tours' and '/api/v1/tours/:id'..
// POST a new tour , update a new Tour , delete Tour
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);


//server start
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port Number : ${port}`);
});
