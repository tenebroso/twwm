(function () {
	'use strict';

	angular
		.module('app')
		.directive('featuredPosts', ['FeaturedService', function (FeaturedService) {
			return {
				restrict:'E',
				templateUrl: "App/Templates/Global/featuredPosts.tpl.html",
				link: function (scope, el, attr) {

					FeaturedService.getFeatured(attr.category).then(function (response) {
						scope.featured = response.data.news;
					});

					if (attr.category === "events")
						scope.postType = "Events";
					else
						scope.postType = "Posts";

				}
			};
		}]);
})();