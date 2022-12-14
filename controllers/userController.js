/* eslint-disable prettier/prettier */

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
