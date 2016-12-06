(function () {
	'use strict';

	angular
        .module('app')
        .factory('Page', PageFactory);

	PageFactory.$inject = ['$http'];
	function PageFactory($http) {
		return function (slug) {
			return $http({
				url: '//mdqa.salvationarmy.org/mobilize_endpoint/' + slug + '/json',
				method: 'GET'
			});
		};
	};
})();