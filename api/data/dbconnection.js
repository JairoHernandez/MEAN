/** Mongo native driver */
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = function() {
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            console.log("DB conneciton failed");
            return; // needed to stop funciton execution.
        }
        // set _connection
        _connection = db;
        console.log("DB connection open", db);
    });
};

var get = function() {
    return _connection;
};

module.exports = {open, get};