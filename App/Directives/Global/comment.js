(function () {
	'use strict';

	angular
		.module('app')
		.directive('comment', ['$compile', function ($compile) {
			return {
				restrict: 'E',
				templateUrl: "App/Templates/Global/comment.tpl.html",
			};
		}]);
})();