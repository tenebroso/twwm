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
				method: 'GET'
			});
		};
	};
})();