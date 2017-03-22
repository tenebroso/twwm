(function () {
	'use strict';

	angular
        .module('app')
        .factory('BlogService', BlogService);

	BlogService.$inject = ['$http', 'twwmConfig'];
	function BlogService($http, twwmConfig) {
		return function (categoryName) {

			return $http({
				url: twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'Access-Control-Allow-Origin': undefined,
					'Access-Control-Allow-headers': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Request-Headers': undefined,
					'Origin': undefined,
					'Referer': undefined
				}
			});
		};
	};

})();