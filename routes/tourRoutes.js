/* eslint-disable prettier/prettier */
// const fs = require('fs');

const express = require('express');
const tourController = require('../controllers/tourController');

const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes')


// const app = express();

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// const getAllTours = (req, res) => {
//     res.status(200).json({
//         status: 'sucess',
//         requestedAt: app.requestedTime,
//         results: tours.length,
//         data: {
//             tours,
//         },
//     });
// }

// const createTour = (req, res) => {
//     // console.log(req.body);
//     // res.send('done');
//     const newId = tours[tours.length - 1].id + 1;
//     // console.log(newId);
//     const newTour = Object.assign({ id: newId }, req.body);
//     // console.log(newTour);
//     tours.push(newTour);
//     fs.writeFile(
//         `$(__dirname)/dev-data/data/tours-simple.json`,
//         JSON.stringify(tours),
//         (err) => {
//             res.status(201).json({
//                 status: 'success',
//                 data: {
//                     tour: newTour,
//                 },
//             });
//         }
//     );
// }

// const getSingleTour = (req, res) => {
//     // console.log(req.params);
//     const id = req.params.id * 1;
//     const tour = tours.find((el) => el.id === id);
//     // console.log(tour);

//     // console.log(id);
//     if (!tour || id > tours.length) {
//         res.status(404).json({
//             status: 'fail',
//             data: 'the id does not exsists',
//         });
//     } else {
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour,
//             },
//         });
//     }
// }

// const updateTour = (req, res) => {
//     // console.log(req.params.id);
//     if (req.params.id * 1 > tours.length) {
//         res.status(404).json({
//             status: 'fail',
//             data: 'id does not exsists',
//         });
//     } else {
//         res.status(200).json({
//             status: 'success',
//             data: 'patched data comes here',
//         });
//     }
//     // res.send('sucess');
// }

// const deleteTour = (req, res) => {
//     // console.log(req.params.id);
//     if (req.params.id * 1 > tours.length) {
//         res.status(404).json({
//             status: 'fail',
//             data: 'id does not exsists',
//         });
//     } else {
//         res.status(204).json({
//             status: 'success',
//             data: null,
//         });
//     }
//     // res.send('sucess');
// }

const router = express.Router();

// router.param('id', tourController.checkId)

// router.route('/').get(getAllTours).post(createTour)
// router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)
// router
//   .route('/')
//   .get(tourController.getAllTours)
//   .post(tourController.checkBody, tourController.createTour);
// to get top 5 tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlans);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );


  // nested routes to create review
// POST /tour/dsd544/reviews
// GET  /tour/dsd544/reviews
// GET  /tour/dsd544/reviews/54654sds

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
