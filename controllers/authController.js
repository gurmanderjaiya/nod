/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign(
    { id },
    'this_is_my_secret_dsfkjdsfkjdsflkdslkfdskgjdsglksdlkgjdslkg',
    { expiresIn: '90d' }
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  // const token = jwt.sign(
  //   { id: newUser._id },
  //   'this_is_my_secret_dsfkjdsfkjdsflkdslkfdskgjdsglksdlkgjdslkg',
  //   {
  //     expiresIn: '90d',
  //   }
  // );

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exsists
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  //2. check if user exsists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);
  // const correct = await user.correctPassword(password, user.password);

  // if (!user || !correct) {
  //   return next(new AppError('incorrect password or email', 401));
  // }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect password or email', 401));
  }
  //3. if everything ok send token to client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'sucess',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. getting token and check if it is there
  // console.log(req.headers.authorization.startsWith('Bearer'));
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log('sdfdsf');
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(token);
  if (!token) {
    return next(
      new AppError('you are not logged in ! please login to get access ', 401)
    );
  }
  // 2. verification token

  //3. check if user still exsists

  // 4. check if user changed password after the token was issued

  console.log('hello');
  next();
});
