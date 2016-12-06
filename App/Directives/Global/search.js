(function () {
	'use strict';

	angular
		.module('app')
		.directive('search', function ($state, $http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/search.tpl.html",
				link: function (scope, el, attr) {

					var resultLabel = "results";

					if(attr.type == "events")
						scope.placeText = "Search Events";
					else
						scope.placeText = "Search Blog";

					scope.submitSearch = function (term) {

						if (term)
							scope.searchTerm = term;

						$http({
							method: 'GET',
							url: '//mdqa.salvationarmy.org/mobilize_endpoint/search/news?query=' + scope.searchTerm + '&tags=' + attr.type
						}).then(function successCallback(response) {
							console.log(response);

							if (response.data.totalCount == 0) {
								response.data.objects.push({
									noResults:true,
									content: 'Sorry, there were no results!',
									synopsis: 'Sorry, there were no results!',
									hideInMenu: true
								});
							} else {
								$.each(response.data.objects, function (i, v) {
									response.data.objects[i].content = response.data.objects[i].document.content;
									response.data.objects[i].synopsis = response.data.objects[i].document.synopsis;
									response.data.objects[i].author = response.data.objects[i].document.author;
									response.data.objects[i].thumbFacebookMetaTag = response.data.objects[i].document.thumbFacebookMetaTag;
								});

							}

								if (attr.type == "events")
									scope.vm.events = response.data.objects;
								else
									scope.vm.posts = response.data.objects;

								if (response.data.totalCount == 1) {
									resultLabel = 'result';
								}

								scope.result = response.data.totalCount + ' ' + resultLabel + ' for <span class="search-term">' + scope.searchTerm + '</span>';
							

						}, function errorCallback(response) {});
					}

				}
			};
		});
})();