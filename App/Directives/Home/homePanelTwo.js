(function () {
	'use strict';

	angular
		.module('homePanelTwo', [])
		.directive('twwmHomePanelTwo', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelTwo.tpl.html"
			};
		});
})();