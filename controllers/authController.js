/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

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

  const token = jwt.sign(
    { id: newUser._id },
    'this_is_my_secret_dsfkjdsfkjdsflkdslkfdskgjdsglksdlkgjdslkg',
    {
      expiresIn: '90d',
    }
  );

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
  console.log(user);
  //3. if everything ok send token to client

  const token = '';
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
