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
    password : {
        type : String,
        required : [true , 'Please provide a password'],
        minlength : [8,'A password must have equal or more than 8 characters']
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
});

const User = mongoose.model('User' , userSchema);

module.exports = User;