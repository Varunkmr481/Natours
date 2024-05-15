// Import the Express module. 
const express = require('express');

// Create an instance of an Express application.
const app = express();

// Define a route for GET requests to the root URL ('/').
app.get('/',(req,res)=>{
    res.status(200).json({message : 'Hi from backened!' , app : 'Natour App'})
})

// Define a route for POST requests to the root URL ('/').
app.post('/',(req,res)=>{
    res.send("Post Request ...");
})

// Define the port number on which the server will listen.
const port = 3000;

// Start the server and have it listen on the specified port.
app.listen(port,()=>{
    console.log(`App running on port Number : ${port}`);
})