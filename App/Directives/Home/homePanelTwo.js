(function () {
	'use strict';

	angular
		.module('homePanelTwo', [])
		.directive('homePanelTwo', function ($http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelTwo.tpl.html",
				link: function (scope, el, attr) {
					scope.slidesLoaded = false;

					

					$http({
						method: "GET",
						url: '//migration.salvationarmy.org/mobilize_endpoint/homePanelTwo/json'
					}).success(function (data) {
						scope.panelTwo = data;
						scope.slidesLoaded = true;
					});
				}
			};
		});
})();