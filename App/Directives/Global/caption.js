(function () {
	'use strict';

	angular
		.module('app')
		.directive('caption', ['$compile', function ($compile) {
			return {
				restrict: 'C',
				link: function (scope, element, attrs) {
					$(element).captionjs({
						'force_dimensions': true
					});
				}
			};
		}]);
})();