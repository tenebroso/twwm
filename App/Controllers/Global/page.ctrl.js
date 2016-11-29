(function () {
	'use strict';

	angular
        .module('app')
        .controller('PageController', PageController);

	PageController.$inject = ['$rootScope', '$http', '$state'];
	function PageController($rootScope, $http, $state) {
		var vm = this;

		if ($state.params.pageName == null || $state.params.pageName == 'undefined') {
			$state.go('home');
			return;
		}
		
		$http({
			method: "GET",
			url: '//migration.salvationarmy.org/mobilize_endpoint/' + $state.params.pageName + '/json'
		}).success(function (data) {
			vm.page = data;
		});

	}

})();