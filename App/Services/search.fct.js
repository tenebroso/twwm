(function () {
	'use strict';

	angular
        .module('app')
        .factory('SearchService', SearchService);

	SearchService.$inject = ['$http', 'twwmConfig'];
	function SearchService($http, twwmConfig) {

		var search = {
			submitSearch: submitSearch,
			getResultsLabel: getResultsLabel
		};
		return search;

		function getResultsLabel(response, term) {
			console.log(response.data.totalCount == 1);
			return response.data.totalCount + ' ' + (response.data.totalCount == 1 ? 'results' : 'result') + ' for <span class="search-term">' + term + '</span>';
		}

		function getPostType(scope) {
			return scope.postType == "Posts" ? "blog" : "events";
		}

		function submitSearch(term, scope) {
			return getResults(term, getPostType(scope));
		}

		function getResults(term, type) {

			return $http({
				url: twwmConfig.publicEndpoint + '/search/news?query=' + term + '&tags=' + type,
				method: 'GET'
			})
				.then(getResultsComplete)
				.catch(getResultsError);

			function getResultsComplete(response) {
				if (response.data.totalCount === 0) {
					return handleNoResults(response);
				} else {
					return handleResults(response);
				}
			}

			function handleNoResults(response) {
				response.data.objects.push({
					noResults: true,
					content: 'Sorry, there were no results!',
					synopsis: 'Sorry, there were no results!',
					hideInMenu: true,
					published: true
				});
				return response;
			}

			function handleResults(response) {
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
			}

			function getResultsError(error) {
				console.log(error);
			}

		};

		
	};

})();