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

	BlogController.$inject = ['$rootScope', '$http'];
	function BlogController($rootScope, $http) {
		var vm = this;

		$http({
			method: 'GET',
			url: '//migration.salvationarmy.org/mobilize_endpoint/news/json/all/false/0/999?tag=blog',
		})
		.success(function (data, status) {
			vm.posts = data.news;
			$rootScope.posts = vm.posts;
		})
		.error(function (data, status) {
			
		});

		return;

	}

})();