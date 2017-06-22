var mongoose = require('mongoose');
//var dburl = 'mongodb://localhost:27017/meanhotel';
// mongoose.connect(dburl);

mongoose.connect(process.env.MONGODB_URI);

// the event is actually called 'connected'.
mongoose.connection.on('connected', () => {
	//console.log('Mongoose connected to ' + dburl);
	console.log('Mongoose connected to ' + process.env.MONGODB_URI);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

mongoose.connection.on('error', () => {
	console.log('Mongoose connection error');
});

// PAAS provider like Heroku uses SIGTERM
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected through app termination (SIGINT).');
		process.exit(0);
	});
});

process.once('SIGUSR2', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected through app termination (SIGUSR2).');
		process.kill(process.pid, 'SIGUSR2');
	});
});

// BRING IN SCHEMAS AND MODELS

require('./hotels.model.js');
require('./users.model');

