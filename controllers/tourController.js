/* eslint-disable arrow-body-style */
// eslint-disable-next-line prettier/prettier
/* eslint-disable lines-between-class-members */
/* eslint-disable prettier/prettier */
// const express = require('express');
// const fs = require('fs');
// const app = express();
const APIFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filter() {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     //1. Advanced filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort() {
//     //2. sorting
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       // console.log(sortBy);
//       //   query = query.sort(req.query.sort);
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt');
//     }
//     return this;
//   }

//   limitFields() {
//     // 3. field limiting ie keeping only field that we want to send
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }

//   paginate() {
//     //4 pagination
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }
// }

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// exports.checkId = (req, res, next, val) => {
//   console.log(`the value of id is : ${val}; tours length is:${tours.length}`);
//   if (val > tours.length) {
//     res.status(404).json({
//       status: 'fail',
//       data: 'the id does not exsists',
//     });
//   } else {
//     next();
//   }
// };
// eslint-disable-next-line prettier/prettier
// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       body: 'missing name or price',
//     });
//   }

//   next();
// };

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'sucess',
//     requestedAt: app.requestedTime,
// results: tours.length,
// data: {
//   tours,
// },
//   });
// };

// exports.getAllTours = async (req, res) => {
//   try {
//     // console.log(req.query);

//     // const tours = await Tour.find();

//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy',
//     // });
//     // build query
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach((el) => delete queryObj[el]);
//     // console.log(req.query, queryObj);

//     // {difficulty:'easy',duration:{ $gte:5}} required one
//     // { duration: { gte: '5' }, page: '2' }

//     // const tours = await Tour.find(req.query);
//     // const tours = await Tour.find(queryObj);
//     // filter
//     // const query = Tour.find(queryObj);
//     // const tours = await query;

//     //1. Advanced filtering
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // console.log(JSON.parse(queryStr));
//     // let query = Tour.find(JSON.parse(queryStr));

//     //2. sorting
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query = query.sort(req.query.sort);
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort('-createdAt');
//     // }

//     //3. field limiting ie keeping only field that we want to send
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select('-__v');
//     // }

//     //4 pagination
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const numOfTours = await Tour.countDocuments();
//     //   if (skip >= numOfTours) throw new Error('this page does not exsists');
//     // }

//     // const tours = await Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     //execute query
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     // const tours = await query;
//     const tours = await features.query;

//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getAllTours = catchAsync(async (req, res, next) => {
  //execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const tours = await query;
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// exports.createTour = (req, res) => {
// console.log(req.body);
// res.send('done');
//   const newId = tours[tours.length - 1].id + 1;
// console.log(newId);
//   const newTour = Object.assign({ id: newId }, req.body);
// console.log(newTour);
//   tours.push(newTour);
//   fs.writeFile(
//     `$(__dirname)/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };
// exports.createTour = async (req, res) => {
//   try {
//     // const newTour = new Tour({})
//     // newTour.save()

//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//       //   message: 'invalid data sent',
//     });
//   }
// };

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.createTour = factory.createOne(Tour)

// exports.getSingleTour = (req, res) => {
// console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
// console.log(tour);
// console.log(id);
// if (!tour || id > tours.length) {
//     res.status(404).json({
//         status: 'fail',
//         data: 'the id does not exsists',
//     });
// }
// else {
// res.status(200).json({
//     status: 'success',
//     data: {
//         tour,
//     },
// });
// }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.getSingleTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     Tour.findOne({ _id: req.params.id });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       //   message: err,
//       message: 'invalid data sent',
//     });
//   }
// };

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews')
  // .populate({
  //   path:'guides',
  //   select:'-__v -passwordChangedAt'
  // });
  // Tour.findOne({ _id: req.params.id });
    // console.log(req.params.id)
  if (!tour) {
    return next(new AppError('no tour found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// exports.updateTour = (req, res) => {
// console.log(req.params.id);
// if (req.params.id * 1 > tours.length) {
//     res.status(404).json({
//         status: 'fail',
//         data: 'id does not exsists',
//     });
// } else {
//   res.status(200).json({
//     status: 'success',
//     data: 'patched data comes here',
//   });
// }
// res.send('sucess');
// };

// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       //   message: err,
//       message: 'invalid data sent',
//     });
//   }
// };

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('no tour found with this id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

exports.updateTour = factory.updateOne(Tour)

// exports.deleteTour = (req, res) => {
// console.log(req.params.id);
// if (req.params.id * 1 > tours.length) {
//     res.status(404).json({
//         status: 'fail',
//         data: 'id does not exsists',
//     });
// } else {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// }
// res.send('sucess');
// };


exports.deleteTour = factory.deleteOne(Tour)

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('no tour found with this id', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: {
//       data: null,
//     },
//   });
// });

// exports.getTourStats = async (req, res) => {
//   try {
//     const stats = await Tour.aggregate([
//       {
//         $match: { ratingsAverage: { $gte: 4.5 } },
//       },
//       {
//         $group: {
//           _id: '$difficulty',
//           // _id:{$toUpper : '$difficulty'}
//           // _id: '$ratingsAverage',
//           num: { $sum: 1 },
//           numRatings: { $sum: '$ratingsQuantity' },
//           avgRating: { $avg: '$ratingsAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: '$price' },
//         },
//       },
//       {
//         // use one(1) for ascending
//         $sort: { avgPrice: 1 },
//       },
//       // {
//       //   $match: { _id: { $ne: 'easy' } },
//       // },
//     ]);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// exports.getMonthlyPlans = async (req, res) => {
//   try {
//     const year = req.params.year * 1;
//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           // no of tours use sum = -1
//           numTourStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       {
//         $addFields: { month: '$_id' },
//       },
//       {
//         // remove _id put it =0
//         $project: {
//           _id: 0,
//         },
//       },
//       {
//         // sort descending put =-1
//         $sort: { numTourStarts: -1 },
//       },
//       // {
//       //   $limit:6
//       // }
//     ]);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         plan,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getMonthlyPlans = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
