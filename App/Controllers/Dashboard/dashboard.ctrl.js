(function () {
	'use strict';

	angular
        .module('app')
        .controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', '$http', '$state'];
	function DashboardController($rootScope, $http, $state) {
		var vm = this;
		console.log($state);
	}

})();