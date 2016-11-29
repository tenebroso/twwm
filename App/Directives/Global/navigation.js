(function () {
	'use strict';

	angular
		.module('app')
		.directive('navigation', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/nav.tpl.html"
			};
		})
		.directive('classWhenSticky', function ($window) {
			var $win = angular.element($window);
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var topClass = attrs.classWhenSticky, // get CSS class from directive's attribute value
						offsetTop = element.offset().top; // get element's top relative to the document
					$win.on('scroll', function (e) {
						if ($win.scrollTop() > offsetTop + $win.height()) {
							element.addClass(topClass);
						} else {
							element.removeClass(topClass);
						}
					});
				}
			};
		});
})();