(function () {
	'use strict';

	angular
        .module('app')
        .controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$state', '$rootScope', '$timeout', 'UserService', 'AuthService', 'ResponseService', 'GDoSService'];

	function RegisterController($state, $rootScope, $timeout, UserService, AuthService, ResponseService, GDoSService) {
		var vm = this;

		vm = {
			getTerritories: getTerritories,
			getLatLong: getLatLong,
			locationIsShared: true,
			postalCode: '',
			registerUser: registerUser,
			territories: [],
			user: {}
		}

		$rootScope.hideLoading();

		vm.getTerritories();
		vm.getLatLong();

		return vm;

		function getTerritories() {
			GDoSService.getTerritories()
				.then(function (res) {
					if (res.data.data) {
						vm.territories = res.data.data;
					} else {
						vm.territories = res.data;
					}

				})
				.catch(function (res) {
					console.log(res);
				});
		}

		function error(err) {
			ResponseService.error(err);
		}

		function success(response) {
			console.log(response);
			$rootScope.hideLoading();
		}

		function getLatLong() {
			if ("geolocation" in navigator) {
				return navigator.geolocation.getCurrentPosition(function (success) {

					vm.user.latitude = success.coords.latitude;
					vm.user.longitude = success.coords.longitude;
 
				}, function (error) {
					vm.locationIsShared = false;
				});
			} else {
				vm.locationIsShared = false;
			}
		}

		function loginNewlyRegisteredUser(res, user) {
			console.log(res);
			var attempts = 0;

			function tryLogin(res) {
				if (attempts === 3 && UserService.getToken('access_token') == null) {
					AuthService.loginError(res);
				} else {
					AuthService.login(user.username, user.password)
					.then(function (res) {
						AuthService.storeToken(res.data.access_token, res.data.refresh_token);
						UserService.storeUser();
					})
					.catch(function (err) {
						attempts++;
						tryLogin(err);
					});
				}
				
			}

			$timeout(tryLogin, 1000);

		}

		function registerUser() {

			var username = vm.user.username;
			var password = vm.user.password;

			$rootScope.addLoading();
 
			UserService.registerUser(vm.user)
				//.then(checkPreExistingUser)
				.then(function(res){
					loginNewlyRegisteredUser(res, vm.user)
				})
				.catch(error);
		}
	}

})();