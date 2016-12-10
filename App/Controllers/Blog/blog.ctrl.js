(function () {
	'use strict';

	angular
        .module('app')
        .controller('BlogController', BlogController)
		.filter('words', function () {
			return function (input, words) {
				if (isNaN(words)) return input;
				if (words <= 0) return '';
				if (input) {
					var inputWords = input.split(/\s+/);
					if (inputWords.length > words) {
						input = inputWords.slice(0, words).join(' ') + '…';
					}
				}
				return input;
			};
		});

	BlogController.$inject = ['$rootScope', '$http', 'ReadService'];
	function BlogController($rootScope, $http, ReadService) {
		var vm = this;
		var todaysDate = moment(new Date).format("LL");

		vm.getPosts = function () {

			ReadService('blog')
				.then(function successCallback(response) {

					$.each(response.data.news, function (i, v) {
						var postPublishDate = moment(v.publishDate).format("LL");
						if (moment(todaysDate).isBefore(postPublishDate)) {
							response.data.news[i].published = false;
						}
					});

					vm.posts = response.data.news;
					$rootScope.featuredPosts = vm.posts;
					angular.element('body').removeClass('loading');

				}, function errorCallback(response) {
					// error handling
				});

		};
		
		vm.getPosts();

		return vm;

	}

})();