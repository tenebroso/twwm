(function () {
	'use strict';

	angular
        .module('app')
        .factory('Page', PageFactory);

	PageFactory.$inject = ['$http', 'twwmConfig'];
	function PageFactory($http, twwmConfig) {
		return function (slug) {
			return $http({
				url: twwmConfig.publicEndpoint + '/' + slug + '/json',
				method: 'GET',
				headers:{
					'Authorization': undefined,
					'Access-Control-Allow-Origin':undefined,
					'Access-Control-Allow-headers': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Request-Headers':undefined,
					'Origin': undefined,
					'Referer':undefined
				}
			});
		};
	};
})();