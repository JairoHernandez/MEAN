angular.module('meanhotel').controller('HotelController', HotelController);

//function HotelController($http, $routeParams) {
function HotelController($window, $route, $routeParams, hotelDataFactory, AuthFactory, jwtHelper) {

	var vm = this;
	var id = $routeParams.id;
	console.log('test2');

	//$http.get('/api/hotels/' + id).then(function(response) {
	hotelDataFactory.hotelDisplay(id).then(function(response) {
		// console.log(response);
		vm.hotel = response.data;
		/* Requires converting to array to use track by $index in hotel-rating-directive.js.
		vm.stars = response.data.stars; */
		vm.stars = _getStartRating(response.data.stars);
	});

	function _getStartRating(stars) {
		return new Array(stars);
	}

  	vm.isLoggedIn = function() {
    	if (AuthFactory.isLoggedIn) {
    		return true;
    	} else {
      		return false;
    	}
  	};

	vm.addReview = function() {

		var token = jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;

		var postData = {
			name: username,
			rating: vm.rating,
			review: vm.review
		};

		if (vm.reviewForm.$valid) {
			hotelDataFactory.postReview(id, postData).then(function(response) {

				if (response.status === 201) {
					$route.reload();
				}

			}).catch(function(error) {
				console.log(error);
			});
		} else {
			vm.isSubmitted = true;
		} 
	};
}