(function () {
	'use strict';

	angular
        .module('app')
        .controller('NavController', NavController);

	NavController.$inject = ['$rootScope', '$location'];
	function NavController($rootScope, $location) {
		var vm = this;
		return;
	}

})();