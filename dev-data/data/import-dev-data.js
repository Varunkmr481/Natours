const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
// .connect(process.env.DATABASE_LOCAL
.connect(DB,{
  useUnifiedTopology : true,
  useNewUrlParser : true,
  useCreateIndex : true,
  useFindAndModify : false
}).then(() =>{
  // console.log(con.connection);
  console.log('DB Connection successful !');
})


//Read the file
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

//importing data into database
const importData = async ()=>{
    try{
        await Review.create(reviews);
        console.log("Data successfully loaded!");
        process.exit();
    }catch(err){
        console.log("Error occured !",err)
    }
}

//delete all data from the collection(db)
const deleteData = async () => { 
        try{
            await Review.deleteMany();
            console.log("Data successfully deleted!");
            process.exit();
        }catch(err){
            console.log("Error occured !",err)
        }
}

if(process.argv[2]==="--import"){
    importData();
}else if(process.argv[2]==="--delete"){
    deleteData();
}

console.log(process.argv);