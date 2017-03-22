(function () {
	'use strict';

	angular
        .module('app')
        .factory('ProvidedContentService', ProvidedContentService);

	ProvidedContentService.$inject = ['$http', 'twwmConfig', 'UserService'];
	function ProvidedContentService($http, twwmConfig, UserService) {

		var vm = this;

		vm = {
			getSingle: getSingle,
			getIndex: getIndex,
			flag: flag,
			isResponding: false,
			join: join,
			leave: leave,
			remove: remove
		}

		return vm;

		function getIndex(type, page, size) {
			if (_.isUndefined(page)) {
				page = '0';
			}
			if (_.isUndefined(size)) {
				size = '999';
			}

			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/all/' + page + '/' + size,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function getSingle(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/' + id,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/report/' + type + '/' + id,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function join(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/' + type + '/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function leave(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/' + type + '/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

	};
})();