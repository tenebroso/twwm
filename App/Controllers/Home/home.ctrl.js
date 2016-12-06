(function () {
	'use strict';

	angular
        .module('home', ['slickCarousel', 'homePanelOne', 'homePanelTwo', 'homePanelThree', 'homePanelFour'])
        .controller('HomeController', HomeController);

	HomeController.$inject = ['$rootScope', '$http', '$cookies', '$q', 'Page'];
	function HomeController($rootScope, $http, $cookies, $q, Page) {
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


		$rootScope.scrollTo = function (target) { };


		vm.getHome = function () {
			return $q.all([
				Page('home'),
				Page('homePanelTwo'),
				Page('homePanelThree'),
				Page('homePanelFour')
			]).then(function (responses) {
					$rootScope.panelOne = responses[0].data;
					$rootScope.panelTwo = responses[1].data;
					$rootScope.panelThree = responses[2].data;
					$rootScope.panelFour = responses[3].data;
					$rootScope.slidesLoaded = true;
					console.log($rootScope);
					return $rootScope;
			});
		};

		vm.getHome();

		

	}

})();