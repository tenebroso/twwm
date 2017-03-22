(function () {
	'use strict';

	angular
        .module('app')
		.directive('infiniteScroll', ['$parse', '$window', function ($parse, $window) {
			return function ($scope, element, attrs) {
				var handler = $parse(attrs.infiniteScroll);
				angular.element($window).bind("scroll", function (evt) {
					var scrollTop = element[0].scrollTop,
						scrollHeight = element[0].scrollHeight,
						offsetHeight = element[0].offsetHeight;
					if (scrollTop === (scrollHeight - offsetHeight)) {
						$scope.$apply(function () {
							handler($scope);
						});
					}
				});
			};
		}])
})();