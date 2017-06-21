var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// GET all reviews for a hotel.
module.exports.reviewsGetAll = (req, res) => {
	
	var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);

    Hotel // parse mongodb
        .findById(hotelId) // Retrieves entire object posted below.
        /* Returend doc { _id: 593849aeadf1c8b7691202e8,
        reviews: 
            [ { name: 'Tamas',
            id: '/user/tamas.json',
            review: 'Great hotel',
            rating: 4,
            _id: 593849f682b4ab3711d7efaa,
        createdOn: 2017-06-07T21:20:37.047Z } ] } */
        .select('reviews') // provides speed and performance by just retrieving snippet of all the API data starting at 'reviews' hiearchy level and not top root level.
        .exec((err, doc) => {

            var response = { status : 200, message : [] };

            if (err) {
                console.log("Error finding reviews.");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                 console.log("Hotel id not found in database", id);
                response.status = 404;
                response.message = { "message" : "Hotel ID not found " + id };
            } else {
                response.message = doc.reviews ? doc.reviews : [];
            }     

            console.log("\nReturend doc", response.message); // Use to see how using or not using .select() logs to console. { reviews: ....}

            res.status(response.status).json(response.message);   
        });
};

// GET single review for a hotel.
module.exports.reviewsGetOne = (req, res) => {
    
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log("\nGET reviewId " + reviewId + " for HotelId " + hotelId);

    Hotel // parse mongodb
    .findById(hotelId) // Retrieves entire object.
    //.select('reviews') // provides speed and performance by just retrieving snippet of all the API data starting at root level.
    .exec((err, hotel) => {
        
        var response = { status: 200, message: {}, hotelName: undefined, hotelId: undefined };
        var hotelName;

        if (err) {
            console.log("Error finding review.");
            sponse.status = 500; // Internal server error.
            response.message = err; 
        } else if (!hotel) {
            response.status = 404; // 404 Not found
            response.message = {"message": "Hotel ID not found."};
        } else {
            response.message = hotel.reviews.id(reviewId); // mongoose parse to get review by its id.
            response.hotelName = hotel.name;
            response.hotelId = hotel._id;

            if (!response.message) {
                response.status = 404;
                response.message = { "message": `Review ID ${reviewId} not found.` };
                reviewId = undefined;
            }
        }
        console.log("\n", response.message); // individual review
        /* { createdOn: 2017-06-08T02:44:15.550Z,
             _id: 59384c1e82b4ab3711d7efad,
             rating: 5,
             review: 'Awesome place!',
             id: '/user/steve.json',
             name: 'Steve' } */
        console.log("Returned " + reviewId + " for hotel " + response.hotelName + " with hoteId " + hotel._id); // To get hotel.name you cannoat use .select('reviews') entry, which will be a perf hit.
        res.status(response.status).json(response.message);
    });
};


var _addReview = (req, res, hotel) => {
    hotel.reviews.push({
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });

    hotel.save((err, hotelUpdated) => {
        if (err) {
            res.status(500).json(err);
        } else {
            console.log("\nDocument -->", hotelUpdated);
              //Document --> { __v: 1,
              // _id: 593ac5e4fb4f5b1b485aefed,
              // reviews: 
              //  [ { name: 'Simon',
              //      rating: 5,
              //      review: 'This place is great!',
              //      _id: 593ad520c86e731f8051e133,
              //      createdOn: 2017-06-09T17:04:32.732Z },
              //    { name: 'Simon',
              //      rating: 5,
              //      review: 'This place is great!',
              //      _id: 593ad56ad4653a1fab9e5fa0,
              //      createdOn: 2017-06-09T17:05:46.673Z },
              //    { name: 'Jairo',
              //      rating: 5,
              //      review: 'This place is great!',
              //      _id: 593ad7090868d2203c3dae99,
              //      createdOn: 2017-06-09T17:12:41.850Z },
            res.status(201).json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
        }
    });
};

// subdocuments are accessed through parent doc.
module.exports.reviewsAddOne = (req, res) => {

    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);

    Hotel // parse mongodb
        .findById(hotelId) // Retrieves entire object posted below.
        .select('reviews') // provides speed and performance by just retrieving snippet of all the API data starting at 'reviews' hiearchy level and not top root level.
        .exec((err, doc) => {

            var response = { status : 200, message : [] };

            if (err) {
                console.log("Error finding reviews.");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                console.log("Hotel id not found in database", hotelId);
                response.status = 404;
                response.message = { "message" : "Hotel ID not found " + hotelId };
            } 

            if (doc) {
                _addReview(req, res, doc);
            } else {
                res.status(response.status).json(response.message);   
            }
        });
};

module.exports.reviewsUpdateOne = (req, res) => {
    
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

    Hotel // parse mongodb
    .findById(hotelId) // Retrieves entire object.
    .select('reviews') // provides speed and performance by just retrieving snippet of all the API data starting at root level.
    .exec((err, hotel) => {
        
        var thisReview;
        var response = { status: 200, message: {}, hotelId: undefined };

        if (err) {
            console.log("Error finding review.");
            sponse.status = 500; // Internal server error.
            response.message = err; 
        } else if (!hotel) {
            response.status = 404; // 404 Not found
            response.message = {"message": "Hotel ID not found."};
        } else {
            // Get the review
            thisReview = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!thisReview) {
              response.status = 404;
              response.message = { "message" : "Review ID not found " + reviewId };
            }
        }

        if (response.status !== 200) {
            //console.log("\n" + response.message);
            console.log("\n" + response.message.name);
            res.status(response.status).json(response.message);
        } else {
            console.log("!!!!", hotel);
            console.log("&&&&", hotel.reviews.id(reviewId));
            thisReview.name = req.body.name;
            thisReview.rating = req.body.rating;
            thisReview.review = req.body.review;

            hotel.save((err, reviewUpdated) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    //console.log(reviewUpdated);
                    res.status(204).json(); // 204 No Content
                }
            });
        }

    });

};

// Identical to reviewsUpdateOne except for one line.
module.exports.reviewsDeleteOne = (req, res) => {

    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

    Hotel // parse mongodb
    .findById(hotelId) // Retrieves entire object.
    .select('reviews') // provides speed and performance by just retrieving snippet of all the API data starting at root level.
    .exec((err, hotel) => {
        
        var thisReview;
        var response = { status: 200, message: {}, hotelId: undefined };

        if (err) {
            console.log("Error finding review.");
            sponse.status = 500; // Internal server error.
            response.message = err; 
        } else if (!hotel) {
            response.status = 404; // 404 Not found
            response.message = {"message": "Hotel ID not found."};
        } else {
            // Get the review
            thisReview = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!thisReview) {
              response.status = 404;
              response.message = { "message" : "Review ID not found " + reviewId };
            }
        }

        if (response.status !== 200) {
            //console.log("\n" + response.message);
            console.log("\n" + response.message.name);
            res.status(response.status).json(response.message);
        } else {
            hotel.reviews.id(reviewId).remove();

            hotel.save((err, reviewUpdated) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    //console.log(reviewUpdated);
                    res.status(204).json(); // 204 No Content
                }
            });
        }

    });

};