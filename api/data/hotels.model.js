var mongoose = require('mongoose');

// Nested Schema must be defined before parent Schema.
var reviewSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	review: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		"default": Date.now
	}
});

// Another nested Schema.
var roomSchema = new mongoose.Schema({
	type: String,
	number: Number,
	description: String,
	photos: [String],
	price: Number
});


// Parent schema
var hotelSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true // Provides validation otherwise cannot save entered name.
	}, 
	stars: {
		type: Number,
		min: 0,
		max: 5,
		default: 0 // If you dont set rating set to 0. Some browsers require double quotes "default" since it's a reserved JS keyword.
	},
	services: [String],
	description: [String],
	photos: [String],
	currency: String,
	reviews: [reviewSchema], // Array of objects. You cannot query a review in this nested setup.
	rooms: [roomSchema], // Another array of objects.
	location: {
		address: String,
		// Always store values longitude(E/W) and latitude(N/S) om that order.
		coordinates: {
			type: [Number], 
			index: '2dsphere'
		}
	}
});

// model name='Hotel', schema=hotelSchema, collection_name='hotels'
// If collection_name is not given then by default it create and use a lower-case plural version of model_name.

mongoose.model('Hotel', hotelSchema);
// This works too.
// var Hotel = mongoose.model('Hotel', hotelSchema); 
// module.exports = {Hotel};