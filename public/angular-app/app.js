// run(run) get's executed after the injector is created and is used to kickstart the application.
angular.module('meanhotel', ['ngRoute', 'angular-jwt']).config(config).run(run);

function config($httpProvider, $routeProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider
    .when('/', {
      templateUrl: 'angular-app/main/main.html',
      access: {
        restricted: false
      }
    })
    .when('/hotels', {
      templateUrl: 'angular-app/hotel-list/hotels.html',
      controller: HotelsController,
      controllerAs: 'vm',
      access: {
        restricted: false
      }
    })
    .when('/hotel/:id', {
      templateUrl: 'angular-app/hotel-display/hotel.html',
      controller: HotelController,
      controllerAs: 'vm',
      access: {
        restricted: false
      }
    })
    .when('/register', {
      templateUrl: 'angular-app/register/register.html',
      controller: RegisterController,
      controllerAs: 'vm',
      access: {
        restricted: false
      }
    })
    .when('/profile', {
      templateUrl: 'angular-app/profile/profile.html',
      access: {
        restricted: true // Accessible only when logged in.
      }
    })
    .otherwise({
      redirectTo: '/'
    });
}

/* IF not logged in and no token. */

function run($rootScope, $location, $window, AuthFactory) {
  $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
        event.preventDefault(); // Meaning we dont want to navigate to that path.
        $location.path('/'); // redirect user to root /.
    }
  });
}