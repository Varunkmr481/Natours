const express = require('express');
const fs = require('fs');

const app = express();

// Middleware to parse incoming JSON requests.
app.use(express.json());

// Read and parse the tours data from the JSON file.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// Define a route for GET requests to '/api/v1/tours'.
app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status : 'success',
        data : {
            tours  
        }
    })
})


// Define a route for GET requests to '/api/v1/tours/:id'.
app.get('/api/v1/tours/:id',(req,res)=>{
    // console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id == id);
    
    // console.log(tour);

    if(tours.length < id){
        return res.status(404).json({
            status : "fail",
            message : "Invalid Id"
        });
    }

    res.status(200).json({
        status : "success",
        data : {
            tour
        }
    })
})


// POST a new tour
app.post('/api/v1/tours',(req,res)=>{
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1 ;
    const newTour = Object.assign({id : newId }, req.body)
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
        res.status(200).json({
            status : "success",
            data : {
                tour : newTour
            }
        })
    });
})


// Define the port number and start the server
const port = 3000;
app.listen(port,()=>{
    console.log(`App running on port Number : ${port}`);
})