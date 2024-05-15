// Import the Express module ,fs module 
const express = require('express');
const fs = require('fs');

// Create an instance of an Express application.
const app = express();

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


// Define the port number on which the server will listen.
const port = 3000;

// Start the server and have it listen on the specified port.
app.listen(port,()=>{
    console.log(`App running on port Number : ${port}`);
})