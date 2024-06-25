const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id : id },process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async (req,res,next) => {
    // const newUser = await User.create(req.body); //User.save
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword
    });

    // console.log(process.env.JWT_EXPIRES_IN);

    const token = signToken(newUser._id);

    res.status(201).json({
        status : "success",
        token,
        data : {
            user : newUser
        }
    });
});


exports.login = catchAsync( async (req,res,next) => {
    const { email , password } = req.body ;

    // 1) Check if the email & password exists
    if(!email || !password){
        return next(new AppError("Please provide email and password",400))
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({email : email}).select('+password'); 
    // const correct = user.correctPassword(password,user.password);
    
    // console.log(user);

    if(!user || !(await user.correctPassword(password,user.password)) ){
        return next(new AppError("Incorrect email or password!",401));
    }

    // 3) If everything is ok , send token to client
    const token = signToken(user._id);

    // 4) Sending the token
    res.status(200).json({
        status : 'success',
        token
    })
})