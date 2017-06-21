var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel'); // No need to export it from hotels.models.js just access this way!!!
// This works too.
// var {Hotel} = require('../data/hotels.model.js'); 

var runGeoQuery = (req, res) => {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (isNaN(lng) || isNaN(lat)) {
        res.status(400).json({"message": "If supplied in querystring latitude and longitude should be a number."});
        return;
    }

    // A geoJSON point
    var point = { type: "Point", coordinates: [lng,lat] }; // lng 47.502649, lat 19.066785
    // Hotels within maxdistance in meters from coordinates, limit number of returned records.
    var geoOptions = { spherical: true, maxdistance: 2000, num: 5 }; 

    Hotel
        // Mongoose method. It does not let us chain exec() method so we have to pass in a callback.
        .geoNear(point, geoOptions, (err, results, stats) => {

            if (err) {
                console.log("Error calculating hotel(s) location.");
                res.status(500).json(err);
            } 

            console.log('Geo results', results);
            console.log('Geo stats', stats);
            res.status(200).json(results);
        });

};

module.exports.hotelsGetAll = (req, res) => {

    console.log('Requested by user:' + req.user); // User accessible thanks to middleware.

    // Set before talking to db.
    var offset = 0;
    var count = 5; 
    var maxCount = 10;

    // req.query are those parameters after the ?.
    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return
    }

    if (req.query && req.query.offset) {
        // querystring values are strings we need parseInt to make it a number.
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        // querystring values are strings we need parseInt to make it a number.
        count = parseInt(req.query.count, 10);
    }
    
    if (isNaN(offset) || isNaN(count)) { 
        res.status(400).json({"message": "If supplied in querystring count and offset should be a number."});
        return;
    }


    if (count > maxCount) {
        res.status(400).json({ "message": `Count limit of ${maxCount} exceeded.` }); // 400 Bad request.
        return;
    }

    // http://localhost:3000/api/hotels?offset=5&count=1
    // mongoose find method
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec((err, hotels) => { // hotels behaves as a return(hence returns a callback).

            if (err) {
                console.log("Error finding hotels");
                res.status(500).json(err);
            } else {
                console.log("Found hotels", hotels.length);
                res.json(hotels);
            }
        });
};

module.exports.hotelsGetOne = (req, res) => {

    var hotelId = req.params.hotelId;
    console.log("\nGET hotelId", hotelId);

    Hotel
        .findById(hotelId)
        .exec((err, doc) => {

            var response = { status: 200, message: doc };

            if (err) {
                console.log("Error loading hotel.");
                response.status = 500; // Internal server error.
                response.message = err;                
            // If doc returned is empty.
            } else if (!doc) {
                response.status = 404; // 404 Not found
                response.message = {"message": "Hotel ID not found."};
            }
            //console.log("\n" + response.message);
            console.log("\n" + response.message.name);
            res.status(response.status).json(response.message);
        });
};

var _splitArray = (input) => {
    var output;
    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
}

module.exports.hotelsAddOne = (req, res) => {

    Hotel
        // before we can send this data we need to preprocess it.
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars, 10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates: [
                    parseFloat(req.body.lng), 
                    parseFloat(req.body.lat)
                ]
            }

        }, (err, hotel) => {
            if (err) {
                console.log("Error creating hotel");
                res.status(400).json(err);
            } else {
                console.log("Hotel created", hotel);
                res.status(201).json(hotel);
            }

        });
};


module.exports.hotelsUpdateOne = (req, res) => {

    var hotelId = req.params.hotelId;

    Hotel
        .findById(hotelId)
        .select("-reviews -rooms") // Exclude reviews Exclude rooms
        .exec((err, doc) => {

            var response = { status: 200, message: doc };

            if (err) {
                console.log("Error loading hotel.");
                response.status = 500; // Internal server error.
                response.message = err;                
            // If doc returned is empty.
            } else if (!doc) {
                response.status = 404; // 404 Not found
                response.message = {"message": "Hotel ID not found."};
            }

            if (response.status !== 200) {
                //console.log("\n" + response.message);
                console.log("\n" + response.message.name);
                res.status(response.status).json(response.message);
            } else {
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.slocation = {
                    address: req.body.address,
                    coordinates: [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                };

                doc.save((err, hotelUpdated) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        console.log(hotelUpdated);
                        res.status(204).json(); // 204 No Content
                    }
                });
            }
        });

};


module.exports.hotelsDeleteOne = (req, res) => {

    var hotelId = req.params.hotelId;

    Hotel.
        findByIdAndRemove(hotelId)
        .exec((err, hotel) => {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log("Hotel deleted");
                res.status(204).json();
            }
        });

};



//A
// var db = dbconn.get();
//     var collection = db.collection('hotels');

//     console.log("***********POST new hotel***********");

//     if (req.body && req.body.name && req.body.stars) {

//         newHotel = req.body;
//         newHotel.stars = parseInt(req.body.stars, 10);
//         console.log(newHotel); // POST request has 'body'.
//         collection.insertOne(newHotel, (err, response) => {
//             console.log(response.ops);
//             res.status(201).json(req.body);
//         });
//     } else {
//         console.log('Data missing from body');
//         res.status(400).json({message: "Required data missing from body"});
//     }