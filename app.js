require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./api/routes');
var bodyParser = require('body-parser');

// Print out to the console only when a request comes in for path /css.
app.use((req, res, next) => {
    console.log(`\n+++ ${req.method}: ${req.url} +++`); 
    next();
});

// by default when you goto localhost:3000 server will know to go to public folder and load index.html.
// everything in public is accessible by browser.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


// enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended:false })); // Must use 'urlencoded' for forms. Others include 'raw' and 'json'. Run it after static files and before routes api. Option 'extended' prevents warning in console when runnin the app. Setting to false just requries strings and array from form body, true will gives you access to other data types, which typically we dont need.
app.use(bodyParser.json()); // for post form in public/angular-app/hotel-display/hotel.html to post correctlly
app.use('/api', routes);
//A

app.set('port', 3000);
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log(`Magic happens on port ${port}`);
});
//B



//A
// app.get('/json', (req, res) => {
//     console.log("GET the json");
//     res.status(200).json({"jsondata": true});
// });

// app.get('/file', (req, res) => {
//     console.log("GET the homepage");
//     res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
// });

//B
// app.listen(3000, () => {
//     console.log(`Started up on port ${port}`); 
// });