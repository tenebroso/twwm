(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmLogin', function () {
			return {
				templateUrl: "App/Templates/Account/login.tpl.html"
			};
		});
})();