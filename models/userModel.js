const mongoose = require('mongoose');
const validator = require('validator');

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
    password : {
        type : String,
        required : [true , 'Please provide a password'],
        minlength : [8,'A password must have equal or more than 8 characters']
    },
    confirmPassword : {
        type : String,
        required : [true,'Please confirm your password!']
    }
});

const User = mongoose.model('User' , userSchema);

module.exports = User;