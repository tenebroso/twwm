(function () {
	'use strict';

	angular
		.module('homePanelOne', [])
		.directive('homePanelOne', function ($http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelOne.tpl.html",
				link: function (scope, el, attr) {
					$http({
						method: "GET",
						url: '//migration.salvationarmy.org/mobilize_endpoint/home/json'
					}).success(function (data) {
						scope.panelOne = data;
					});
				}
			};
		});
})();