(function () {
	'use strict';

	var BlogCtrl = function ($scope, $state, ReadService, $timeout) {
		var vm = this;

		vm.detail = {};
		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;

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
					vm.detail = collection[0];
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

	BlogCtrl.$inject = ['$scope', '$state', 'ReadService', '$timeout'];

	angular
        .module('app')
        .controller('BlogController', BlogCtrl);

})();