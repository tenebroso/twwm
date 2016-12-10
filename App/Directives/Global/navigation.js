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
		.directive('classWhenSticky', function ($window, $location) {
			var $win = angular.element($window);
			return {
				link: function (scope, element, attrs) {
					var topClass = attrs.classWhenSticky, 
						offsetTop = element.offset().top;
					$win.on('scroll', function (e) {
						if ($win.scrollTop() > offsetTop + $win.height()) {
							element.addClass(topClass);
						} else {
							if ($location.hash() == "") {
								element.removeClass(topClass);
							}
						}
					});
				}
			};
		});
})();