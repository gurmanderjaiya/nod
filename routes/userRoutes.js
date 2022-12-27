/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         data: 'this route is not implemented yet'
//     })
// }
// const createUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         data: 'this route is not implemented yet'
//     })
// }
// const getSingleUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         data: 'this route is not implemented yet'
//     })
// }
// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         data: 'this route is not implemented yet'
//     })
// }
// const deleteuser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         data: 'this route is not implemented yet'
//     })
// }

const router = express.Router();

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteuser)

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteuser);

module.exports = router;
