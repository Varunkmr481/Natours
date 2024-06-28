const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true ,'Please tell us your name!']
    },
    email : {
        type : String,
        required : [true,'Please provide your email address'],
        unique : true,
        lowercase : true,
        validate : {
            validator : validator.isEmail,
            message : 'Please provide a valid email address'
        }
    },
    photo : {
        type : String
    },
    role :{
        type : String,
        enum : ['user' , 'guide' , 'lead-guide' , 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true , 'Please provide a password'],
        minlength : [8,'A password must have equal or more than 8 characters'],
        select : false
    },
    confirmPassword : {
        type : String,
        required : [true,'Please confirm your password!'],
        validate : {
            // This only works for save methods - save() & create()
            validator : function(val){
                return val === this.password;
            },
            message : "The password's do not match"
        }
    },
    passwordChangedAt : {
        type : Date
    }
});

userSchema.pre('save',async function(next) {
    //only run this function if password was really modified !
    if(!this.isModified('password')){
        return next();
    }

    //hashing password with salt of 12
    this.password = await bcrypt.hash(this.password,12);

    // setting confirmPassword field to undefined
    this.confirmPassword = undefined ;

    // this.changedPasswordAfter = Date.now() - 1000 ;
});

userSchema.methods.correctPassword = async function(candidatePassword ,userPassword ){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000 , 10);

        // console.log(changedTimestamp,JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    //false means not changed 
    return false; 
}

const User = mongoose.model('User' , userSchema);

module.exports = User;