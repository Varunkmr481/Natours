const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel.js')

const tourSchema = new mongoose.Schema({
    name : {
      type : String ,
      required : [true,"A tour must have a name!"],   //validator  
      maxlength : [40 , "A name must have an equal or less than 40 characters"],
      minlength : [10 , "A name must have an equal or more than 10 characters"],
      unique : true,
      trim : true,
      // validate : {
      //   validator : validator.isAlpha ,
      //   message : "A name should only contains characters"
      // }
    },
    slug : {
      type : String
    },
    duration : {
      type : Number,
      required : [true,"A tour must have a duration"]
    },
    maxGroupSize : {
      type : Number,
      required : [true , "A tour must have a group size"]
    },
    difficulty : {
      type : String,
      required : [true , "A tour must have a difficulty"],
      enum : {
        values : ['easy','medium','difficult'],
        message : "Difficulty can be either : easy , medium , difficult"
      }
    },
    ratingAverage : {
      type : Number,
      default : 4.5,
      min : [1 , "The rating must be above 1.0"],
      max : [5 , "The rating must be below 5.0"],
      set : val => Math.round(val * 10) / 10    // 4.6666 -> 46.666 -> 47 -> 4.7
    }, 
    ratingQuantity : {
        type : Number ,
        default : 0,
    },
    price : {
      type : Number,
      required : [true , "A tour must have a price!"]
    },
    priceDiscount : {
      type : Number,
      validate : {
        validator : function(val){
          //this only points to current document on NEW document creation
          return val < this.price;
        },
        message : "Discount price ({VALUE}) should be below regular price"
      }
    },
    summary : {
      type : String,
      trim : true,
      required : [true , "A tour must have a summary!"]
    },
    description : {
      type : String,
      trim : true
    },
    imageCover: {
      type : String,
      required : [true , 'A tour must have a cover image!']
    },
    image : [String],
    createdAt : {
      type : Date ,
      default : Date.now()
    },
    startDates : [Date],
    secretTour : {
      type : Boolean,
      default : false
    },
    startLocation : {
      // GeoJSON
      type : {
        type : String,
        default : 'Point',
        emun : ['Point']
      },
      coordinates : [Number],
      address : String,
      description : String
    },
    locations : [
      {
        type : {
          type : String,
          default : 'Point',
          enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String,
        day : Number
      }
    ],
    guides : [
      {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
      }
    ]
  },{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
  })

  // tourSchema.index({price : 1});
  tourSchema.index({ price: 1, ratingAverage: -1 });
  tourSchema.index({ slug: 1 });
  tourSchema.index({ startLocation : '2dsphere' });

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  })

  // virtual populate
  tourSchema.virtual('reviews',{
    ref : 'Review',
    foreignField : 'tour',
    localField : '_id'
  });

  //DOCUMENT MIDDLEWARE : RUNS BEFORE .save() & .create()
  tourSchema.pre('save' , function(next){
    // console.log(this);
    this.slug = slugify(this.name, {lower : true});
    next();
  });

  // tourSchema.pre('save' , async function(next){
  //   const guidesPromises = this.guides.map(async id => await User.findById(id));
  //   this.guides = await Promise.all(guidesPromises);
  //   next();
  // })

  // tourSchema.pre('save' , function(next){
  //   console.log("Will save document ..... ");
  //   next();
  // })

  //Document post hook middleware : runs after .save() or .create()
  // tourSchema.post('save',function(doc,next){
  //   console.log(doc);
  //   next();
  // })

  //QUERY MIDDLEWARE FOR METHODS STARTING WITH FIND
  tourSchema.pre(/^find/, function(next){
    // tourSchema.pre('find', function(next){
      this.find({ secretTour : { $ne : true } });
      // console.log(this);
      this.start = Date.now();
      next();
    });
  
  // Auto-populate 'guides' in tour docs, excluding '__v' and 'passwordChangedAt', 
  // before 'find' queries.  
  tourSchema.pre(/^find/, function(next){
    this.populate({
      path : 'guides',
      select : "-__v -passwordChangedAt"
    });
    
    next();
  });


  tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} milliseconds`);
    // console.log(docs);
    next();
  })

  //AGGREGATION MIDDLEWARE
  // tourSchema.pre('aggregate',function(next){
    // console.log(this.pipeline().unshift({ $match : { secretTour : { $ne : true } } }));
  //   next();
  // })

  const Tour = mongoose.model('Tour',tourSchema);

  module.exports = Tour;