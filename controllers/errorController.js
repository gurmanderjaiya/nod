/* eslint-disable prettier/prettier */
const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational trusted errors : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or other unknown errors: dont leak error details
    // 1. log error
    console.log('Error', err);

    //2. send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `duplicate field value:${value} . please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `invalid input data . ${errors.join('. ')}`;
  return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   error: err,
    //   message: err.message,
    //   stack: err.stack,
    // });

    sendErrorDev(err, res);
  } else if (process.env.production === 'production') {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    // });

    let error = { ...err };
    //db stands for database
    if (error.name === 'castError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'validationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
