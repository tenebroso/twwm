(function () {
	'use strict';

	angular
        .module('app')
        .controller('ActivitiesController', ActivitiesController);

	ActivitiesController.$inject = ['$http', '$rootScope', 'twwmConfig', 'UserService', 'ResponseService', 'AuthService'];

	function ActivitiesController($http, $rootScope, twwmConfig, UserService, ResponseService, AuthService) {
		var vm = this;

		vm = {
			completedActivities: [],
			joinedActivities: [],
			myActivities: myActivities
		}


		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (newValue, oldValue) {
			if (!_.isUndefined(newValue)) {
				vm.myActivities(newValue);
			}
		});

		return vm;

		

		function myActivities(username) {
			getActivities(username)
				.then(function (res) {
					vm.joinedActivities = _.orderBy(res.data.joinedActivityList, 'start', 'desc');
					vm.completedActivities = _.orderBy(res.data.completedActivityList, 'start', 'desc');
					

					AuthService.refreshToken()
						.then(function (res) {
							$rootScope.hideLoading();
							AuthService.storeToken(res.data.access_token, res.data.refresh_token, false);
						})
						.catch(function (err) {
							console.log(err);
						});
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function getActivities(username) {
			var endDate = moment().format('YYYY-MM-DD');
			return $http({
				url: twwmConfig.contentEndpoint + '/dashboard/2017-01-01/' + endDate + '?username=' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}
	}

})();