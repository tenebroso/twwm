(function () {
	'use strict';

	angular
		.module('app')
		.directive('dashboardLeaderboard', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Dashboard/leaderboard.tpl.html"
			};
		});
})();