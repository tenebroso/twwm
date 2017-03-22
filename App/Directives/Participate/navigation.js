(function () {
	'use strict';

	angular
		.module('app')
		.directive('participateNavigation', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Participate/navigation.tpl.html"
			};
		});
})();