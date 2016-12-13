(function () {
	'use strict';

	angular
        .module('app')
        .controller('PageController', PageController);

	PageController.$inject = ['$rootScope', '$http', '$state', 'twwmConfig'];
	function PageController($rootScope, $http, $state, twwmConfig) {
		var vm = this;

		if ($state.params.pageName == null || $state.params.pageName == 'undefined') {
			$state.go('home');
			return;
		}
		
		$http({
			method: "GET",
			url: twwmConfig.publicEndpoint + '/' + $state.params.pageName + '/json'
		}).then(function (response) {
			vm.page = response.data;
			angular.element('body').removeClass('loading');
		});

	}

})();