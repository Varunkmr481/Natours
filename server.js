const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

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

// SERVER START
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port Number : ${port}`);
});

//HANDLE UNHANDLED REJECTIONS
process.on('unhandledRejection',(err)=>{
  console.log(err.name,err.message);
  server.close(()=>{
    process.exit(1);
  })
})