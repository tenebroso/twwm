(function () {
	'use strict';

	angular
        .module('app')
        .controller('AdminController', AdminController);

	AdminController.$inject = ['$rootScope', '$http', 'UserService', 'ResponseService'];
	function AdminController($rootScope, $http, UserService, ResponseService) {
		var vm = this;

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

	}

})();