(function () {
	'use strict';

	angular
        .module('app')
        .factory('FeaturedService', FeaturedService);

	FeaturedService.$inject = ['$http', 'twwmConfig'];
	function FeaturedService($http, twwmConfig) {
		return {
			getFeatured: function (categoryName) {
				return $http.get(twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName).then(function (response) {
					return response;
				});
			}
		}
	};

})();