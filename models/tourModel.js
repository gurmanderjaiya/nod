/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal to 40 character'],
      minlength: [10, 'A tour must have at least  0 character'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have have a valid duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'difficulty must be either : difficult,easy or medium',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'a rating must be above or equal to 1'],
      max: [5, 'a rating must be below or equal to 1'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    // priceDiscount: Number,
    priceDiscount: {
      type: Number,
      // validate: function (val) {
      //   return val < this.price;
      // },
      validate: {
        validator: function (val) {
          // it only works when we are creationg a new document but not on update
          return val < this.price;
        },
        message: 'the discounted price({value}) must be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // hide from results
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware : runs only before .save() and .create()  || also called hooks

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//post  Middleware  runs after a document is saved has also acess to document  || also called hooks

// tourSchema.post('save', function (doc, next) {
//   console.log(this)
//   next()
// });

// query Middleware

// tourSchema.pre('find', function (next) {
// works for only find
tourSchema.pre(/^find/, function (next) {
  // works for find findone , etc
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`the query took ${this.start - Date.now()} milliseconds `);
//   console.log(docs);
//   next();
// });

// aggregation middleware

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
