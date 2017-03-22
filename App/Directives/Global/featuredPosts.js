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
						scope.featured = _.orderBy(response.data.news, 'publishDate', 'desc');

						if (attr.category === "events") {
							scope.postType = "Events";
							scope.featured = _.orderBy(scope.featured, ['publishDate'], ['asc']);
						} else {
							scope.postType = "Posts";
						}


					});

					
				}
			};
		}]);
})();