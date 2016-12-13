(function () {
	'use strict';

	angular
        .module('app')
        .factory('ReadService', ReadService);

	ReadService.$inject = ['$http', 'twwmConfig'];
	function ReadService($http, twwmConfig) {
		return function (categoryName) {
			return $http({
				url: twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName,
				method: 'GET'
			});
		};
	};

})();