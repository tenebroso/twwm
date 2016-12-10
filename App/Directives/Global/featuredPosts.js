(function () {
	'use strict';

	angular
		.module('app')
		.directive('featuredPosts', ['$http', '$timeout', function ($http, $timeout) {
			return {
				restrict:'E',
				templateUrl: "App/Templates/Global/featuredPosts.tpl.html",
				link: function (scope, el, attr) {

					if (attr.category === "events")
						scope.postType = "Events";
					else
						scope.postType = "Posts";

				}
			};
		}]);
})();