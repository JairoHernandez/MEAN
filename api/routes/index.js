var express = require('express');
var router = express.Router();
var ctrlHotels = require('../controllers/hotels.controllers');
var ctrlReviews = require('../controllers/reviews.controllers');
var ctrlUsers = require('../controllers/users.controllers.js');


router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll)
    .post(ctrlHotels.hotelsAddOne);
    //A

router
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne)
    .delete(ctrlHotels.hotelsDeleteOne);

// Review routes
router
    .route('/hotels/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

//Authentication
router
    .route('/users/register')
    .post(ctrlUsers.register);
router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;

    //A
    // .get((req, res) => {
    //     console.log("GET the json");
    //     res.status(200).json({"jsondata": true});
    // })
    // .post((req, res) => {
    //     console.log("POST the json route");
    //     res.status(200).json({"jsondata": "POST received"});
    // });
    // BOTH .get and .post are chained executed together
    /* POST: /api/json
       POST the json route */