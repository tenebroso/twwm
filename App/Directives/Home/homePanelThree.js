(function () {
	'use strict';

	angular
		.module('homePanelThree', [])
		.directive('homePanelThree', function ($http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelThree.tpl.html",
				link: function (scope, el, attr) {
					scope.panelThreeSlidesLoaded = false;

					document.addEventListener('lazybeforeunveil', function (e) {
						console.log('unveil three');
					});

					$http({
						method: "GET",
						url: '//migration.salvationarmy.org/mobilize_endpoint/homePanelThree/json'
					}).success(function (data) {
						scope.panelThree = data;
						scope.panelThreeSlidesLoaded = true;
					});
				}
			};
		});
})();