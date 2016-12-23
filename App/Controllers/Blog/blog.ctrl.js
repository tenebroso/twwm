(function () {
	'use strict';

	var BlogCtrl = function ($scope, $state, ReadService, SearchService) {
		var vm = this;

		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;
		vm.resetSearch = resetSearch;
		vm.submitSearch = submitSearch;

		function resetSearch() {
			vm.hasTerm = false;
			delete vm.result;

			if ($state.current.name == 'blog.post')
				vm.getDetail();
			else
				vm.getIndex();
		}

		function submitSearch(term, scope) {
			SearchService.submitSearch(term, scope)
				.then(function (response) {
					vm.index = response.data.objects;
					vm.hasTerm = true;
					vm.result = SearchService.getResultsLabel(response, term);
				})
		}

		function getIndex() {
			ReadService('blog')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = collection;
					vm.index = collection;
				})
				.then($scope.hideLoading);
		};

		function getDetail() {
			ReadService('blog')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = collection;
					return collection.filter(function (post) {
						return post.urlAlias === vm.postUrl;
					});
				})
				.then(function (collection) {
					vm.index = collection;
				})
				.then($scope.hideLoading);
		};

		$scope.$on('$stateChangeSuccess', function () {
			vm.postUrl = $state.params.postUrl;
			$scope.$wrapperClass = 'wrapper';

			if (vm.postUrl)
				getDetail();
			else
				getIndex();
		});

	};

	function readSuccess(response) {

		$.each(response.data.news, function (i, v) {
			var postPublishDate = moment(v.publishDate, moment.ISO_8601);
			if (moment(new Date(), moment.ISO_8601).isBefore(postPublishDate)) {
				response.data.news[i].published = false;
			}
		});

		return response.data.news;

	}

	BlogCtrl.$inject = ['$scope', '$state', 'ReadService', 'SearchService'];

	angular
        .module('app')
        .controller('BlogController', BlogCtrl);

})();