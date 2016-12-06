(function () {
	'use strict';

	angular
        .module('app')
        .controller('EventsController', EventsController);

	EventsController.$inject = ['$rootScope','$http', 'page'];
	function EventsController($rootScope, $http, page) {
		var vm = this;

		$http({
			method: 'GET',
			url: '//migration.salvationarmy.org/mobilize_endpoint/news/json/all/false/' + page + '/999?tag=events',
		})
		.success(function (data, status) {
			vm.events = data.news;
			$.each(vm.events, function (i, event) {
				var addr = $.parseHTML(event.synopsis);
				vm.events[i].address = '//www.google.com/maps/dir/Current+Location/' + addr[2].innerText + '/data=!4m2!4m1!3e0';
			});
			$rootScope.events = vm.events;
		})
		.error(function (data, status) {
			
		});

		$rootScope.getDay = function () {
			return moment(new Date).format("dddd");
		};

		$rootScope.getDate = function () {
			return moment(new Date).format("D MMM YYYY");
		};

		return;
	}

})();