(function () {
	'use strict';

	angular
        .module('app')
        .controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', '$http'];
	function DashboardController($rootScope, $http) {
		var vm = this;
		
	}

})();