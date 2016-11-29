(function () {
	'use strict';

	angular
        .module('home', ['slickCarousel', 'homePanelOne', 'homePanelTwo', 'homePanelThree', 'homePanelFour'])
        .controller('HomeController', HomeController);

	HomeController.$inject = ['$rootScope', '$http', '$cookies'];
	function HomeController($rootScope, $http, $cookies) {
		var vm = this;

		vm.title = 'The Whole World Mobilising';

		if ($cookies.get('country') == undefined) {
			$http({
				method: "GET",
				url: '//freegeoip.net/json/'
			}).success(function (data) {
				if (data.country_code && data.country_code == 'US') {
					$cookies.put('country', 'US')
					//vm.title = 'The Whole World Mobilizing';
				}
			});
		} else {
			if ($cookies.get('country') == 'US') {
				vm.title = 'The Whole World Mobilizing';
			} else {
				return;
			}
		}


		$rootScope.scrollTo = function (target) {};
		

	}

})();