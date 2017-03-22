(function () {
	'use strict';

	angular
        .module('app')
        .controller('LoginController', LoginController);

	LoginController.$inject = ['$rootScope', '$state', 'AuthService', 'UserService', 'ResponseService', 'localStorageService'];
	function LoginController($rootScope, $state, AuthService, UserService, ResponseService, localStorageService) {
		var vm = this;

		vm = {
			doesNotMatch: false,
			email: '',
			forgotPassword: forgotPassword,
			login: login,
			password: '',
			resetPassword: resetPassword
		}

		$rootScope.hideLoading();

		return vm;

		function error(err) {
			ResponseService.error(err);
		}

		function submit(key, val) {
			return localStorageService.set(key, val);
		}

		function forgotPassword() {

			$rootScope.passwordReset = AuthService.resetPassword;

			function resetPassword(callback) {

				if (typeof callback != 'undefined') {
					callback = success;
				}
				var postObj = {
					url: twwmConfig.authEndpoint + '/api/registration/reset_request?username=' + encodeURIComponent($rootScope.email),
					method: 'GET'
				}

				$http(postObj).then(callback).catch(error);
			}

			$rootScope.passwordMessages = {
				instruction: 'Please enter your email address. A password reset link will be emailed to you.',
				complete:false
			}

			$.magnificPopup.open({
				items: {
					src: '#passwordReset',
					type: 'inline'
				},
				removalDelay: 300,
				mainClass: 'twwm-fade'
			});
		}

		function resetPassword() {
			if (vm.password !== vm.password2) {
				vm.doesNotMatch = true;
				return;
			} else {
				AuthService.setNewPassword(vm.email, vm.password, $state.params.token)
					.then(function(res){
						login();
						vm.doesNotMatch = false;
					})
					.catch(function(err){
						ResponseService.error(err);
						vm.doesNotMatch = false;
					});
			}
			
		}

		function login() {

			localStorageService.set('username', vm.email);

			AuthService.login(vm.email, vm.password, 'participate.index')
				.then(function (res) {
					AuthService.storeToken(res.data.access_token, res.data.refresh_token);
					return res;
				})
				.then(UserService.storeUser)
				.catch(AuthService.loginError);
		}
	}

})();