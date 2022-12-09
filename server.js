const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('unCaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught exception  shutting down');

  process.exit(1);
});
dotenv.config({ path: './config.env' });

const app = require('./app');

// const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
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
// console.log(process.env)

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     requirs: [true, 'a tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'a tour must have a price'],
//   },
// });

// const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'a test tour 2',
//   rating: 4.5,
//   price: 600,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('error:', err);
//   });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App  is running on port ${port}.... `);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection shutting down');
  server.close(() => {
    process.exit(1);
  });
});
