(function () {
	'use strict';

	angular
        .module('app')
        .controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', '$http', 'UserService', 'MediaService', 'twwmConfig', 'ResponseService'];
	function DashboardController($rootScope, $http, UserService, MediaService, twwmConfig, ResponseService) {
		var vm = this;
		
		$rootScope.addLoading();

		vm = {
			dashboardDetails:{},
			getDashboard: getDashboard,
			showActivities: false,
			uploadPhoto: uploadPhoto
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
			if (!_.isUndefined(newValue) || !_.isUndefined(oldValue)) {
				var username = $rootScope.currentUser.username;

				vm.getDashboard(username)
				.then(function (res) {
					vm.dashboardDetails = res.data;

					angular.forEach(vm.dashboardDetails.topUsersByActivity, function (user, i) {

						UserService.getUserDetails(user.username)
							.then(function (res) {

								if (res.data.firstName != "First Name") {
									vm.dashboardDetails.topUsersByActivity[i].username = res.data.firstName + ' ' + _.truncate(res.data.lastName, {
										'length': 2,
										'omission': '.'
									});
								} else {
									vm.dashboardDetails.topUsersByActivity[i].username = "Anonymous";
								}
								vm.dashboardDetails.topUsersByActivity[i].photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								ResponseService.error(err);
							});
					});

					angular.forEach(vm.dashboardDetails.topUsersByPeopleReached, function (user, i) {

						UserService.getUserDetails(user.username)
							.then(function (res) {

								if (res.data.firstName != "First Name") {
									vm.dashboardDetails.topUsersByPeopleReached[i].username = res.data.firstName + ' ' + _.truncate(res.data.lastName, {
										'length': 2,
										'omission': '.'
									});
								} else {
									vm.dashboardDetails.topUsersByPeopleReached[i].username = "Anonymous";
								}
								vm.dashboardDetails.topUsersByPeopleReached[i].photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								ResponseService.error(err);
							});
					});
				})
				.catch(function (err) {
					ResponseService.error(err);
				})
				.finally(function (res) {
					$rootScope.hideLoading();
				});
			}
		});
		
		

		return vm;

		function getDashboard(username) {
			var endDate = moment().format('YYYY-MM-DD');

			return $http({
				url: twwmConfig.contentEndpoint + '/dashboard/2017-01-01/' + endDate + '?username=' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function uploadPhoto(file) {
			MediaService.updatePhoto(file);
		}


	}

})();