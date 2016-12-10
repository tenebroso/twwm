(function () {
	'use strict';

	angular
        .module('app')
        .factory('ReadService', ReadService);

	ReadService.$inject = ['$http'];
	function ReadService($http) {
		return function (categoryName) {
			return $http({
				url: '//migration.salvationarmy.org/mobilize_endpoint/news/json/all/false/0/999?tag=' + categoryName,
				method: 'GET'
			});
		};
	};

})();