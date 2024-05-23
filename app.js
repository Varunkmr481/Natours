const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

// MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req,res,next)=>{
  console.log('Hello from the middleware 😎');
  next();
})

app.use((req,res,next)=>{
  req.requestedTime = new Date().toISOString();
  next();
})


// Read and parse the tours data from the JSON file.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestedTime);

  res.status(200).json({
    status: 'success',
    requestedTime : req.requestedTime ,
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

const getAllUsers = (req,res)=>{
  res.status(500).json({
    status : 'ERROR',
    message : "This route is not yet implemented!"
  })
}

const createUser = (req,res)=>{
  res.status(500).json({
    status : 'ERROR',
    message : "This route is not yet implemented!"
  })
}

const getUser = (req,res)=>{
  res.status(500).json({
    status : 'ERROR',
    message : "This route is not yet implemented!"
  })
}

const updateUser = (req,res)=>{
  res.status(500).json({
    status : 'ERROR',
    message : "This route is not yet implemented!"
  })
}

const deleteUser = (req,res)=>{
  res.status(500).json({
    status : 'ERROR',
    message : "This route is not yet implemented!"
  })
}


// Define a route for GET requests to '/api/v1/tours' and '/api/v1/tours/:id'..
// POST a new tour , update a new Tour , delete Tour
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

  userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

  userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

  app.use('/api/v1/tours',tourRouter);
  app.use('/api/v1/users',userRouter);

// SERVER START
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port Number : ${port}`);
});
