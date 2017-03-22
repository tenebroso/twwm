(function () {
	'use strict';

	angular
        .module('app')
        .factory('AuthService', AuthService);

	AuthService.$inject = ['$rootScope', '$http', '$state', 'twwmConfig', 'localStorageService', 'ResponseService'];
	function AuthService($rootScope, $http, $state, twwmConfig, localStorageService, ResponseService) {

		var userObject = {
			"grant_type": "password",
			"username": "",
			"password": ""
		}

		var authService = {
			hastoken: hastoken,
			login: login,
			loginError: loginError,
			logout: logout,
			refreshToken: refreshToken,
			resetPassword: requestPasswordReset,
			setNewPassword: setNewPassword,
			storeToken: storeToken
		}


		return authService;

		function requestPasswordReset() {

			function completedPassword() {
				$rootScope.passwordMessages.instruction = 'Thank you! A password reset link has been emailed to you.';
				$rootScope.passwordMessages.complete = true;
			}

			var postObj = {
				url: twwmConfig.authEndpoint + '/api/registration/reset_request?username=' + encodeURIComponent($rootScope.email),
				method: 'GET'
			}

			$http(postObj).then(completedPassword).catch(ResponseService.error);
		}

		function setNewPassword(email, pass, token) {
			var postObj = {
				data: {
					"password": pass,
					"username": email,
					"verificationToken": token
				},
				url: twwmConfig.authEndpoint + '/api/registration/reset',
				method: 'POST'
			}

			$rootScope.addLoading();

			return $http(postObj);
		}

		function login(email, pass) {

			$rootScope.addLoading();

			userObject.username = email;
			userObject.password = pass;

			var data = $.param(userObject);

			var postObj = {
				url: twwmConfig.authEndpoint + '/oauth/token',
				data: data,
				headers:{
					'content-type': "application/x-www-form-urlencoded"
				},
				method:'POST'
			}

			return $http(postObj);

		}

		function refreshToken() {

			$rootScope.addLoading();

			var userObject = {
				"grant_type": "refresh_token",
				"refresh_token": localStorageService.get('refresh_token')
			}

			var data = $.param(userObject);

			var postObj = {
				url: twwmConfig.authEndpoint + '/oauth/token',
				data: data,
				headers: {
					'content-type': "application/x-www-form-urlencoded"
				},
				method: 'POST'
			}

			return $http(postObj);

		}

		function loginError(err) {
			ResponseService.error(err, ' Incorrect email and password combination, please try again.');
			$rootScope.hideLoading();
		}

		function storeToken(access, refresh, redirect) {

			function submit(key, val) {
				return localStorageService.set(key, val);
			}


			if (access && refresh) {
				submit('access_token', access);
				submit('refresh_token', refresh);
				if (_.isUndefined(redirect) || redirect !== false) {
					redirectAfterLogin();
				}
				return true;
			} else {
				return false;
			}
		}

		function redirectAfterLogin(path) {
			if (path)
				$state.go(path);
			else
				$state.go('participate.index');		
		}

		function logout() {

			function empty(key) {
				return localStorageService.remove(key);
			}


			empty('access_token');
			empty('refresh_token');
			empty('username');
			empty('user_lat');
			empty('user_lng');
			$rootScope.currentUser = {};
			$state.go('home');
		}

		function hastoken() {
			if (localStorageService.get('access_token') && localStorageService.get('refresh_token'))
				return true;
			else
				return false;
		}

	};

})();