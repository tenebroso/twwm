(function () {
	'use strict';

	angular
		.module('homePanelThree', [])
		.directive('twwmHomePanelThree', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelThree.tpl.html"
			};
		});
})();