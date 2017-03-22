(function () {
	'use strict';

	angular
        .module('app')
        .factory('GDoSService', GDoSService);

	GDoSService.$inject = ['$http', 'twwmConfig', 'localStorageService'];
	function GDoSService($http, twwmConfig, localStorageService) {

		var gdos = {
			getTerritories: getTerritories
		};

		return gdos;

		function getTerritories() {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return $http({
					url: 'https://public.api.gdos.salvationarmy.org/rest/validobjects/territory',
					method: 'GET',
					headers: {
						'Authorization': undefined,
						'AccessControlAllowheaders': undefined
					}
				});
			} else {
				return $http({
					url: twwmConfig.authEndpoint + '/api/gdos/territories',
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

			

		}


	};

})();