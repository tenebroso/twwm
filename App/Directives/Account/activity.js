(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmActivity', function () {
			return {
				templateUrl: "App/Templates/Account/activity.tpl.html"
			};
		});
})();