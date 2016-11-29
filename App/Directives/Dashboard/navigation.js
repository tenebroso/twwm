(function () {
	'use strict';

	angular
		.module('app')
		.directive('dashboardNavigation', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Dashboard/navigation.tpl.html"
			};
		});
})();