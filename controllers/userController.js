/* eslint-disable prettier/prettier */

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  // console.log(obj, allowedFields);
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'this route is not implemented yet',
  });
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //1. create error if user posts password data
  if (req.body.password || req.body.confirmpassword) {
    return next(
      new AppError(
        'this route is not for password update , please use /updatepassword for the same,400'
      )
    );
  }
  //2. filtered out unwanted fields that are not allowed to be updated
  const filterdBody = filterObj(req.body, 'name', 'email');
  //3. update user Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'this route is not implemented yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'this route is not implemented yet',
  });
};
exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'this route is not implemented yet',
  });
};
