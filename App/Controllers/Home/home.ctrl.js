(function () {
	'use strict';

	angular
        .module('home', ['slickCarousel', 'homePanelOne', 'homePanelTwo', 'homePanelThree', 'homePanelFour'])
        .controller('HomeController', HomeController);

	HomeController.$inject = ['$rootScope', '$http', '$q', 'Page', '$anchorScroll', '$location'];
	function HomeController($rootScope, $http, $q, Page, $anchorScroll, $location) {
		var vm = this;

		vm.title = 'The Whole World Mobilising';

		vm.gotoAnchor = function (x) {
			var newHash = 'anchor' + x;
			if ($location.hash() !== newHash) {
				// set the $location.hash to `newHash` and
				// $anchorScroll will automatically scroll to it
				$location.hash('anchor' + x);
				var header = angular.element('header');
				header.addClass('fixed');
			}
		};


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
					angular.element('body').removeClass('loading');
					return $rootScope;
			});
		};

		vm.getHome();

		

	}

})();