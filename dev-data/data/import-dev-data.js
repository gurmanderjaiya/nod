/* eslint-disable prettier/prettier */
const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const Tour = require(`../../models/tourModel`);

const DB =
  'mongodb+srv://gurmander:gurmander@cluster0.ysezbkd.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // useUnifiedTopology: true
  })
  .then((conn) => {
    // console.log(conn.connection);
    console.log('DB connected successfully');
  });

// Read Json File

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//   import data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfullyu added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
