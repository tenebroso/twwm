(function () {
	'use strict';

	var BlogCtrl = function ($scope, $state, BlogService, SearchService) {
		var vm = this;

		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;
		vm.resetSearch = resetSearch;
		vm.submitSearch = submitSearch;
		vm.totalCount = 0;
		vm.limit = 1;
		vm.increaseLimit = function () {
			if (vm.limit < vm.totalCount) {
				vm.limit += 1;
			}
		};

		//vm.currentPage = '0';
		//vm.pageSize = '5';
		
		//vm.totalPages = 0;
		//vm.getNumber = function (num) {
		//	return new Array(num);
		//};

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
			//if (_.isUndefined(qty)) {
			//	qty = vm.pageSize;
			//}

			//if (_.isUndefined(page)) {
			//	page = vm.currentPage;
			//} else if (typeof page === "number") {
			//	page = page.toString();
			//	vm.currentPage = page;
			//}

			BlogService('blog')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = collection;
					vm.index = collection;
				})
				.then($scope.hideLoading)
				.catch(function (err) {
					console.log(err);
				});
		};

		function getDetail() {
			BlogService('blog')
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

		function readSuccess(response) {

			vm.totalCount = response.data.totalCount;

			$.each(response.data.news, function (i, v) {
				var postPublishDate = moment(v.publishDate, moment.ISO_8601);
				if (moment(new Date(), moment.ISO_8601).isBefore(postPublishDate)) {
					response.data.news[i].published = false;
				}
			});

			return response.data.news;

		}

		$scope.$on('$stateChangeSuccess', function () {
			vm.postUrl = $state.params.postUrl;
			$scope.$wrapperClass = 'wrapper';

			if (vm.postUrl)
				getDetail();
			else
				getIndex();
		});

	};

	BlogCtrl.$inject = ['$scope', '$state', 'BlogService', 'SearchService'];

	angular
        .module('app')
        .controller('BlogController', BlogCtrl);

})();