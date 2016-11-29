(function () {
	'use strict';

	angular
        .module('app')
        .factory('ReadService', ReadService);

	ReadService.$inject = ['apiHost', '$http', '$cookieStore', '$rootScope'];
	function ReadService($http, $cookieStore, $rootScope, $timeout, UserService) {
		var service = {};



	}

})();