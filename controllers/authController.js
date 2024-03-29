/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const catchAsync = require('../utils/catchAsync');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign(
    { id },
    'this_is_my_secret_dsfkjdsfkjdsflkdslkfdskgjdsglksdlkgjdslkg',
    { expiresIn: '90d' }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure:true.\
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //removes password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
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

  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
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

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'sucess',
  //   token,
  // });
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

  // console.log(token, 'token');
  if (!token) {
    return next(
      new AppError('you are not logged in ! please login to get access ', 401)
    );
  }
  // 2. verification token
  const decoded = await promisify(jwt.verify)(
    token,
    'this_is_my_secret_dsfkjdsfkjdsflkdslkfdskgjdsglksdlkgjdslkg'
  );
  // console.log(decoded);
  //3. check if user still exsists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'the user belonging to this token does no longer exsists',
        401
      )
    );
  }
  // 4. check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password , please login again', 401)
    );
  }
  console.log('hello');
  // GRANT ACCESS TO PROTECTEED ROUTE
  req.user = currentUser; // might be used in future
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin','lead-guide']..   role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('there is no user with this email address', 404));
  }
  //2. generate the random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //3. send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forgot your password ? submit a patch request with your new password and password confirm to ${resetURL} \n if you didnt forget your password , please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'sucess',
      message: 'token sent to email ',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending email, try again later'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  //2. if token has not expired and there is a user set the new password

  if (!user) {
    return next(new AppError('token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3. update changed password at property for user

  //4. log user in , send jwt

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'sucess',
  //   token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // console.log(user);
  //2. check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is wrong', 401));
  }
  // console.log(user);
  //3.if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4.log user in, send JWT

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'sucess',
  //   token,
  // });
});
