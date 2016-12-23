(function () {
	'use strict';

	var EventsCtrl = function ($scope, $state, ReadService, SearchService, Page) {
		var vm = this;

		vm.featuredEvent = {};
		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;
		vm.resetSearch = resetSearch;
		vm.submitSearch = submitSearch;

		Page('eventPageHeader')
			.then(function (response) {
				vm.featuredEvent.image = response.data.thumbFacebookMetaTag;
				vm.featuredEvent.imageurl = response.data.redirectUrl;
			});

		function resetSearch() {
			vm.hasTerm = false;
			delete vm.result;

			if ($state.current.name == 'events.event')
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
			ReadService('events')
				.then(readSuccess)
				.then(function (posts) {
					vm.index = posts;
					$scope.featured = vm.index;
				})
				.then($scope.hideLoading);
		}

		function getDetail() {
			ReadService('events')
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
		}

		$scope.getDay = function () {
			return moment(new Date).format("dddd");
		};

		$scope.getDate = function () {
			return moment(new Date).format("D MMM YYYY");
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

		$.each(response.data.news, function (i, event) {
			var addr = $.parseHTML(event.synopsis);
			if (addr == null) return;
			response.data.news[i].address = '//www.google.com/maps/dir/Current+Location/' + addr[2].innerText + '/data=!4m2!4m1!3e0';
		});

		return response.data.news;

	}

	EventsCtrl.$inject = ['$scope', '$state', 'ReadService', 'SearchService', 'Page'];

	angular
        .module('app')
        .controller('EventsController', EventsCtrl);

})();