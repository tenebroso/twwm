(function () {
	'use strict';

	angular
        .module('app')
        .factory('FeaturedService', FeaturedService);

	FeaturedService.$inject = ['$http', 'twwmConfig'];
	function FeaturedService($http, twwmConfig) {
		return {
			getFeatured: function (categoryName) {
				var config = {
					headers: {
						'Authorization': undefined,
						'Access-Control-Allow-Origin': undefined,
						'Access-Control-Allow-headers': undefined,
						'AccessControlAllowHeaders': undefined
					}
				}
				return $http.get(twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName, config).then(function (response) {
					return response;
				});
			}
		}
	};

})();