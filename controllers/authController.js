const { promisify } = require('util');
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
        confirmPassword : req.body.confirmPassword,
        passwordChangedAt : req.body.passwordChangedAt,
        role : req.body.role
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

exports.protect = catchAsync(async (req,res,next)=>{
    let token;

    // 1) Getting token & check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token);

    if(!token){
        return next(new AppError('You are not logged In ! Please log In to get access',401));
    }

    // 2) Verfication token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    console.log(decoded);

    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The user belonging to this token no longer exists!',401));
    }

    // 4) Check if user changed password after the token was issued 
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError("User recently Changed password ! Please log in again.",401));
    };

    //GRANT ACCESS TO USER
    req.user = freshUser ;
    next();
});


exports.restrictTo = (...roles) => {
    return (req , res , next) => {
        // roles : ['admin','lead-guide'] , req.user.role = 'user'
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have the permission to perform this action ",403));
        }
        
        next();
    }
}

exports.forgotPassword = catchAsync(async (req,res,next) => {

    // 1) Get user based on the Posted email
    const user = await User.findOne({ email : req.body.email });
    if(!user){
        return next(new AppError("There is no user with this email address ",404))
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false});

    // 3) Send it to the user's email address 
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password ? Submit a patch request with your new Password and 
    PasswordConfirm to ${resetURL}. \n If you didn't forget Password , Please ignore this email !`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
      
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({validateBeforeSave : false})

      return next(
        new AppError(
          'There was an error sending the email. Please try again later!',
          500
        )
      );
    }
});


exports.resetPassword = (req,res) => {

}