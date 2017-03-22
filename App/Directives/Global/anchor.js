(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmAnchor', ['$anchorScroll', '$location', function ($anchorScroll, $location) {
			return {
				restrict: 'C',
				link: function (scope, element, attrs) {

					$(element).on('click', function (e) {
						e.preventDefault();
						$location.hash(attrs.href);
						$anchorScroll();
					});

				}
			}
		}]);
})();