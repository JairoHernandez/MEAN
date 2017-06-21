// angular.module('meanhotel').directive('hotelRating', hotelRating);

// // directive name needs to be in camelCase which then equates to this <hotel-rating>

// function hotelRating() {
// 	return {
// 		restrict: 'E',
// 		// To allow duplicate values in array use track by $index, only applies to array of non-objects.-->
// 		// You can also do a templateUrl and move this into an html file.
// 		template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
// 		bindToController: true,
// 		controller: 'HotelController',
// 		controllerAs: "vm",
// 		scope: {
// 			stars: '@'
// 		}
// 	}
// }

// ANGULAR 1.6 you can opt to use component, which are based off of Angular2, rather than directive.
angular.module('meanhotel').component('hotelRating', {
	bindings: {
		stars: '='
	},
	template: '<small><span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star-empty">{{ star }}</span></small>',
	controller: 'HotelController',
	controllerAs: "vm"
});
