var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.register = function(req, res) {
	console.log('registering user');

	var username = req.body.username;
	var name = req.body.name || null;
	var password = req.body.password;

	User.create({
		username: username,
		name: name,
		//password: password
		password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	}, (err, user) => {
		if (err) {
			console.log(err);
			res.status(400).json(err);
		} else {
			console.log('user created:', user);
			res.status(201).json(user);
		}
	}); 

};

module.exports.login = function(req, res) {

	console.log('logging in user');
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		username: username
	}).exec((err, user) => { // user is the whole user object from DB that contains username: username.
		console.log("exec user: ",user)
		if (err) {
			console.log(err);
			res.status(400).json(err);
		} else {

			if (bcrypt.compareSync(password, user.password)) { // password is from the client, use.password is from DB.
				console.log('User found:', user);
				var token = jwt.sign({ username: user.username }, 's3cr3t', { expiresIn: 3600 });
				//res.status(200).json(user);
				res.status(200).json({ success: true, token: token });
			} else {
				res.status(401).json('Unauthorized');
			}
		}
	});
};

module.exports.authenticate = function(req, res, next) {

	var headerExists = req.headers.authorization;
	console.log('testees:', headerExists);

	if (headerExists) {
		var token = req.headers.authorization.split(' ')[1]; // Authorization Bearer xxx
		console.log('token:', token);
		jwt.verify(token, 's3cr3t', function(error, decoded) { // 's3cr3t' should be an environment varaible not visible in your code.
			if (error)	 {
				console.log(error);
				res.status(401).json('Unauthorized');
			} else {
				// req.user is now accessible for hotelsGetAll() due to this line
				// .get(ctrlUsers.authenticate, ctrlHotels.hotelsGetAll) in index.js.
				req.user = decoded.username; 
				next();
			}
		});
	} else {
		res.status(403).json('No token provided.')
	}

};