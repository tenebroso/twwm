(function () {
	'use strict';

	angular
        .module('app')
        .controller('EventsController', EventsController);

	EventsController.$inject = ['$rootScope', '$http', 'ReadService'];
	function EventsController($rootScope, $http, ReadService) {
		var vm = this;

		vm.getPosts = function () {
			ReadService('events')
				.then(function successCallback(response) {

					$.each(response.data.news, function (i, event) {
						var addr = $.parseHTML(event.synopsis);
						response.data.news[i].address = '//www.google.com/maps/dir/Current+Location/' + addr[2].innerText + '/data=!4m2!4m1!3e0';
					});

					vm.posts = response.data.news;
					$rootScope.featuredPosts = vm.posts;
					angular.element('body').removeClass('loading');

				}, function errorCallback(response) {
					// error handling
				});
		}
		
		vm.getPosts();

		$rootScope.getDay = function () {
			return moment(new Date).format("dddd");
		};

		$rootScope.getDate = function () {
			return moment(new Date).format("D MMM YYYY");
		};

		return vm;
	}

})();