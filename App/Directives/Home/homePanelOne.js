(function () {
	'use strict';

	angular
		.module('homePanelOne', [])
		.directive('twwmHomePanelOne', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelOne.tpl.html"
			};
		});
})();