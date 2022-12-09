/* eslint-disable prettier/prettier */
// const fs = require('fs');

const express = require('express');

const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// 1. middlewares
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello form middleware');
  next();
});

app.use((req, res, next) => {
  app.requestedTime = new Date().toISOString();
  next();
});
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from server side ....', detail: 'fgfgfdg' });
// });

// app.post('/', (req, res) => {
//   res.send('you can post on this route');
// });

// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
//*************
//2.  Route handler functions
// const getAllTours = (req, res) => {
// 	res.status(200).json({
// 		status: 'sucess',
// 		requestedAt: app.requestedTime,
// 		results: tours.length,
// 		data: {
// 			tours,
// 		},
// 	});
// }

// const createTour = (req, res) => {
// 	// console.log(req.body);
// 	// res.send('done');
// 	const newId = tours[tours.length - 1].id + 1;
// 	// console.log(newId);
// 	const newTour = Object.assign({ id: newId }, req.body);
// 	// console.log(newTour);
// 	tours.push(newTour);
// 	fs.writeFile(
// 		`$(__dirname)/dev-data/data/tours-simple.json`,
// 		JSON.stringify(tours),
// 		(err) => {
// 			res.status(201).json({
// 				status: 'success',
// 				data: {
// 					tour: newTour,
// 				},
// 			});
// 		}
// 	);
// }

// const getSingleTour = (req, res) => {
// 	// console.log(req.params);
// 	const id = req.params.id * 1;
// 	const tour = tours.find((el) => el.id === id);
// 	// console.log(tour);

// 	// console.log(id);
// 	if (!tour || id > tours.length) {
// 		res.status(404).json({
// 			status: 'fail',
// 			data: 'the id does not exsists',
// 		});
// 	} else {
// 		res.status(200).json({
// 			status: 'success',
// 			data: {
// 				tour,
// 			},
// 		});
// 	}
// }

// const updateTour = (req, res) => {
// 	// console.log(req.params.id);
// 	if (req.params.id * 1 > tours.length) {
// 		res.status(404).json({
// 			status: 'fail',
// 			data: 'id does not exsists',
// 		});
// 	} else {
// 		res.status(200).json({
// 			status: 'success',
// 			data: 'patched data comes here',
// 		});
// 	}
// 	// res.send('sucess');
// }

// const deleteTour = (req, res) => {
// 	// console.log(req.params.id);
// 	if (req.params.id * 1 > tours.length) {
// 		res.status(404).json({
// 			status: 'fail',
// 			data: 'id does not exsists',
// 		});
// 	} else {
// 		res.status(204).json({
// 			status: 'success',
// 			data: null,
// 		});
// 	}
// 	// res.send('sucess');
// }

// user route handler functions
// const getAllUsers = (req, res) => {
// 	res.status(500).json({
// 		status: "error",
// 		data: 'this route is not implemented yet'
// 	})
// }
// const createUser = (req, res) => {
// 	res.status(500).json({
// 		status: "error",
// 		data: 'this route is not implemented yet'
// 	})
// }
// const getSingleUser = (req, res) => {
// 	res.status(500).json({
// 		status: "error",
// 		data: 'this route is not implemented yet'
// 	})
// }
// const updateUser = (req, res) => {
// 	res.status(500).json({
// 		status: "error",
// 		data: 'this route is not implemented yet'
// 	})
// }
// const deleteuser = (req, res) => {
// 	res.status(500).json({
// 		status: "error",
// 		data: 'this route is not implemented yet'
// 	})
// }

//*************
// app.get('/api/v1/tours', getAllTours);
//*************
// app.post('/api/v1/tours', createTour);
//*************
// app.get('/api/v1/tours/:id', getSingleTour);
//*************
// app.patch('/api/v1/tours/:id', updateTour);
//*************
// app.delete('/api/v1/tours/:id', deleteTour);
//*************
// 3. Routes
// tour routes
// app.route('/api/v1/tours').get(getAllTours).post(createTour)
// app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)

// const tourRoutes = express.Router()
// tourRoutes.route('/').get(getAllTours).post(createTour)
// tourRoutes.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)

// user routes
// app.route('/api/v1/users').get(getAllUsers).post(createUser)
// app.route('/api/v1/users/:id').get(getSingleUser).patch(updateUser).delete(deleteuser)

// const userRoutes = express.Router()
// userRoutes.route('/').get(getAllUsers).post(createUser)
// userRoutes.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteuser)
//*************
// app.use('/api/v1/tours', tourRoutes)
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRoutes)
app.use('/api/v1/users', userRouter);

// for all other request which does not exsists but put it at last only
app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant find ${req.originalUrl} on the server`,
  // });

  // const err = new Error(`cant find ${req.originalUrl} on the server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

// error handler iddleware

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

//*************
// 4. start server
// const port = 3000;

// app.listen(port, () => {
// 	console.log(`App  is running on port ${port}.... `);
// });

module.exports = app;
