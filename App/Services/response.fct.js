(function () {
	'use strict';

	angular
        .module('app')
        .factory('ResponseService', ResponseService);

	ResponseService.$inject = ['$rootScope', '$state', 'localStorageService', 'twwmConfig', '$http'];
	function ResponseService($rootScope, $state, localStorageService, twwmConfig, $http) {

		$rootScope.response = {
			title: 'Error',
			body: 'Sorry, there was an error.'
		}

		var service = {
			success: success,
			error: error
		};

		return service;

		function recordError(res) {

			if (res.data) {
				if (res.data.errorMessage) {
					res.data.errorText = res.data.errorMessage;
				}

				if (res.data.message) {
					res.data.errorText = res.data.message;
				}

				if (res.data.error_description) {
					res.data.errorText = res.data.error_description;
				}
			} else {
				res.data = {
					errorText:""
				}
			}

			if (!res.config) {
				res.config = {
					url:''
				}
			}		

			var data = {
				"WorkstationName": window.navigator.platform ? window.navigator.platform : '',
				"ApplicationVersion": "1.1",
				"Application": "TWWM",
				"Module": "TWWM Repository",
				"Method": $state.current.name,
				"Username": localStorageService.get('username'),
				"HttpStatus": res.status,
				"HttpError": res.statusText,
				"Path": res.config.url || "",
				"Notes": $rootScope.currentUser.territoryCode || "",
				"Generic1": $state.current.controller,
				"Generic2": $state.current.url,
				"Generic3": $state.current.templateUrl,
				"ErrorMessage": res.data.errorText || ""
			}

			var postObj = {
				method: 'POST',
				data:data,
				url: twwmConfig.loggingEndpoint
			}

			return $.post(postObj);
		}

		function success(res) {
			$rootScope.hideLoading();
		}

		function error(err, string) {

			if (typeof err == 'undefined') {
				return;
			}

			if (err.status === 401 && err.data.error == "invalid_token") {
				// Try to get a new refresh token
				if (localStorageService.get('refresh_token') != null) {

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

					$http(postObj)
						.then(function (res) {

							function submit(key, val) {
								return localStorageService.set(key, val);
							}

							submit('access_token', res.data.access_token);
							submit('refresh_token', res.data.refresh_token);

							console.log('refresh token successful');
							$state.reload();
						})
						.catch(function(err){
							console.log("refresh token not successful");

							console.log(err);

							//function empty(key) {
							//	return localStorageService.remove(key);
							//}


							//empty('access_token');
							//empty('refresh_token');
							//empty('username');
							//empty('user_lat');
							//empty('user_lng');
							//$rootScope.currentUser = {};
							//$state.go('home');
						});

				} else {
					localStorageService.clearAll();
					$state.go('login');
				}
			}

			recordError(err)
					.done(function (res) {
						console.log(res);
					})
					.fail(function (res) {
						console.log(res);
					});

			if (err && err.data) {

				var errorMsg;

				if (err.data) {

					if (err.data.error === "invalid_token") {
						localStorageService.clearAll();
						$state.go('login');
						return;
					}

					if (err.data.path == '/uaa/api/registration/new') {
						errorMsg = err.data.message;
					}

					if (err.data.path == '/pray/all/0') {
						errorMsg = 'We are working on fixing an issue with the server and this will be available shortly!';
					}

					if (err.data.error_description)
						errorMsg = err.data.error_description;

					if (err.data.errorMessage)
						errorMsg = err.data.errorMessage;

					$rootScope.response.body += '<br />The message received from the server was: <br /><span class="error-text">' + errorMsg + '</span>';

					if (errorMsg == 'Bad credentials') {
						$rootScope.response.body = ' Incorrect email and password combination, please try again.';
					}
				}

			} else if(typeof err !== "string") {
					if(err.status === -1){
						$rootScope.response.body += '<br /> It looks like we are having trouble connecting to the servers.';
					}
			}

			if (typeof err === "string") {
				$rootScope.response.body += err;
			}

			$.magnificPopup.open({
				items: {
					src: '#errorDialog',
					type: 'inline'
				},
				callbacks: {
					close: function () {
						$rootScope.response.body = 'Sorry, there was an error';
					}
				}
			});

			$rootScope.hideLoading();

		}
	}

})();