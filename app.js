// Import the Express module ,fs module 
const express = require('express');
const fs = require('fs');

// Create an instance of an Express application.
const app = express();

// Middleware to parse incoming JSON requests.
app.use(express.json());

// Read and parse the tours data from the JSON file.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Define a route for GET requests to '/api/v1/tours'.
// When a GET request is made to this URL, send a JSON response with the tours data.
app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status : 'success',
        data : {
            tours  
        }
    })
})

// Define a route for GET requests to '/api/v1/tours'.
// When a POST request is made to this URL, add a new tour to the tours data and save it to the file.
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


// Define the port number on which the server will listen.
const port = 3000;

// Start the server and have it listen on the specified port.
app.listen(port,()=>{
    console.log(`App running on port Number : ${port}`);
})