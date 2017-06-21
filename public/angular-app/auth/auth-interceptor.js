angular.module('meanhotel').factory('AuthInterceptor', AuthInterceptor);

function AuthInterceptor($location, $q, $window, AuthFactory) {

	return {
		request: request,
		resopnse: response,
		responseError: responseError
	}

	function request(config) {
		config.headers = config.headers || {};
		// Get token trom browser's session storage. And $window is a builtin AngularJS service.
		if ($window.sessionStorage.token) {
			config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
		}
		return config;
	}

	function response(response) {
		// Determine if user is actually logged in.
		if (response.status === 200 && $window.sessionStorage.token && !AuthFactory.isLoggedIn) {
			AuthFactory.isLoggedIn = true;
		}

		if (response.status === 401) {
			AuthFactory.isLoggedIn = false;
		}
		return response || $q.when(response);
	}

	function responseError(rejection) {
		if (response.status === 401 || rejection.status === 403) {
			delete $window.sessionStorage.toke;
			AuthFactory.isLoggedIn = false;
			$location.path('/');
		}
		return $q.reject(rejection);
	}
}