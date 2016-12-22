(function () {
	'use strict';

	function flattenObj(object, target, prefix) {
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

	function success(response) {
		if (response.data.totalCount === 0) {
			return noResults(response);
		} else {
			return updateData(response);
		}
	}

	function noResults(response) {
		response.data.objects.push({
			noResults: true,
			content: 'Sorry, there were no results!',
			synopsis: 'Sorry, there were no results!',
			hideInMenu: true,
			published: true
		});
		return response;
	}

	function updateData(response) {
		if (response.data.totalCount === 0) {
			return response;
		} else {
			$.each(response.data.objects, function (i, v) {
				var postPublishDate = moment(v.publishDate);

				// Flatten this object, since it comes back with different nesting
				response.data.objects[i] = flattenObj(response.data.objects[i]);

				// There is no author param currently, so we add this in
				response.data.objects[i].hideAuthor = true;

				// We only want to show events that are occurring after today's date
				if (moment(new Date).isBefore(postPublishDate))
					response.data.objects[i].published = false;
				else
					response.data.objects[i].published = true;
			});

			return response;
		}
	}

	angular
		.module('app')
		.directive('search', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/search.tpl.html",
				controllerAs:'vm',
				controller: ['$scope', '$state', '$http', 'twwmConfig', 'FeaturedService', function ($scope, $state, $http, twwmConfig, FeaturedService) {
					var vm = this;

					vm.detail = {};
					vm.hasTerm = false;
					vm.index = [];
					vm.resultLabel = 'results';
					vm.stateName = $state.params.type;
					vm.term = $state.params.term;
					$scope.$wrapperClass = 'wrapper';

					vm.submitSearch = function (term) {
						if (!term) {
							vm.result = 'Please enter a term';
							//vm[controllerName][getIndex]();
							return;
						}

						if (vm.stateName == 'blog') {
							vm.postType = 'blog';
							vm.controllerName = 'BlogCtrl';
						} else {
							vm.postType = 'events';
							vm.controllerName = 'EventsCtrl';
						}

						$scope[vm.controllerName] = {
							index: [],
							detail: []
						}

						$scope.placeText = term;

						if (vm.postType == 'events')
							$state.go('search.events', { type: 'events', term: term });
						else
							$state.go('search.blog', { type: 'blog', term: term });

						vm.hasTerm = true;
						

						$http({
							method: 'GET',
							url: twwmConfig.publicEndpoint + '/search/news?query=' + term + '&tags=' + vm.postType
						})
							.then(success)
							.then(updateData)
							.then(function (response) {
								if (response.data.totalCount == 1 ? vm.resultLabel = 'result' : '');
								
								return response;
							})
							.then(function (response) {
								$scope[vm.controllerName]['index'] = response.data.objects;
								return response;
							})
							.then(function (response) {
								vm.result = response.data.totalCount + ' ' + vm.resultLabel + ' for <span class="search-term">' + term + '</span>';
							})
							.then($scope.hideLoading);
					}

					vm.resetSearch = function () {
						$state.go(vm.stateName + '.index');
					}

					if (vm.stateName && vm.term) {
						vm.submitSearch(vm.term);
					}

					return vm;
				}],
				link: function (scope, el, attr, searchCtrl) {

					var resultLabel;

					if (scope.placeText)
						return;
				
					if(attr.type == "events")
						scope.placeText = "Search Events";
					else
						scope.placeText = "Search Blog";

				}
			};
		});
})();