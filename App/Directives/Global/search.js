(function () {
	'use strict';

	angular
		.module('app')
		.directive('search', function ($state, $http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/search.tpl.html",
				link: function (scope, el, attr) {

					var resultLabel;
					var flattenObj = function (object, target, prefix) {
						target = target || {};
						prefix = prefix || '';
						angular.forEach(object, function (value, key) {
							if (angular.isObject(value)) {
								flattenObj(value, target, key);
							} else {
								target[key] = value;
							}
						});
						return target;
					};

					var noResults = function (response) {
						response.data.objects.push({
							noResults: true,
							content: 'Sorry, there were no results!',
							synopsis: 'Sorry, there were no results!',
							hideInMenu: true,
							published:true
						});
						scope.vm.posts = response.data.objects;
						angular.element('body').removeClass('loading');
				}

					if(attr.type == "events")
						scope.placeText = "Search Events";
					else
						scope.placeText = "Search Blog";

					scope.resetSearch = function () {
						scope.vm.getPosts();
						scope.vm.hasResults = false;
						scope.vm.result = '';
						scope.vm.hasTerm = false;
						scope.searchTerm = '';
					};

					scope.submitSearch = function (term) {

						if (!term){
							scope.vm.result = 'Please enter a term';
							scope.vm.getPosts();
							return;
						}

						scope.vm.hasTerm = true;

						$http({
							method: 'GET',
							url: '//migration.salvationarmy.org/mobilize_endpoint/search/news?query=' + term + '&tags=' + attr.type
						}).then(function successCallback(response) {

							if (response.data.totalCount == 0) {

								noResults(response);

							} else {
								
								$.each(response.data.objects, function (i, v) {
									response.data.objects[i] = flattenObj(response.data.objects[i]);
									var postPublishDate = moment(v.publishDate);
									if (moment(new Date).isBefore(postPublishDate))
										response.data.objects[i].published = false;
									else
										response.data.objects[i].published = true;
								});



							}


								scope.vm.posts = response.data.objects;

								if (response.data.totalCount == 1)
									resultLabel = 'result';
								else
									resultLabel = "results"

								scope.vm.result = response.data.totalCount + ' ' + resultLabel + ' for <span class="search-term">' + term + '</span>';
								scope.vm.hasResults = true;

								angular.element('body').removeClass('loading');

						}, function errorCallback(response) {
							noResults(response);
						});
					}

					return;

				}
			};
		});
})();