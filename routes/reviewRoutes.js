/* eslint-disable prettier/prettier */
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams:true});

  // nested routes to create review
// POST /tour/dsd544/reviews
// GET  /tour/dsd544/reviews
// GET  /tour/dsd544/reviews/54654sds

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview)

module.exports = router;
