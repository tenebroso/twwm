(function () {
	'use strict';

	angular
        .module('app')
        .factory('UserService', UserService);

	UserService.$inject = ['$rootScope', '$http', '$state', 'twwmConfig', 'localStorageService', 'AuthService', 'ResponseService'];
	function UserService($rootScope, $http, $state, twwmConfig, localStorageService, AuthService, ResponseService) {

		var User = {
			aboveThirteen: true,
			authorities: [
				{
					authority: ''
				}
			],
			corps: '',
			deviceLanguage: window.navigator.language ? window.navigator.language : '',
			deviceTimeZone: String(-(new Date().getTimezoneOffset() / 60)),
			deviceType: window.navigator.platform ? window.navigator.platform : '',
			division: '',
			enabled: true,
			firstName: 'First Name',
			ipAddress: '',
			languagePreference: 'en',
			lastName: 'Last Name',
			latitude: 0,
			locationPermission: true,
			locationSharing: true,
			longitude: 0,
			marketingVerification: true,
			mobileOs: 'web',
			photoUrl: '/Content/Images/camera-white@2x.png',
			registrationLocation: '',
			registrationMethod: 'web',
			territoryCode: '',
			username: ''
		}

		// TODO Request that FirstName and LastName be nullable

		var userService = {
			getLatLng: getLatLng,
			getToken: getToken,
			getUserDetails: getUserDetails,
			getUser:getUser,
			registerUser: registerUser,
			setLatLng: setLatLng,
			storeUser:storeUser,
			updateUser: updateUser
		}

		return userService;

		function getToken(name) {
			if (typeof name === 'string')
				return localStorageService.get(name);
			else
				return localStorageService.get('access_token');
		}


		function registerUser(user) {

			var newUser = Object.assign({}, User, user);

			var userObj = {
				data: newUser,
				method: 'POST',
				url: twwmConfig.authEndpoint + '/api/registration/new'
			}

			return $http(userObj);
		}

		function updateUser(user) {
			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}

			var userObj = {
				data:user,
				method: 'PUT',
				url: twwmConfig.authEndpoint + '/api/registration/edit',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}

			function success(response) {
				console.log(response);
			}

			function error(error) {
				console.log(error);
			}

			return $http(userObj).then(success).catch(error);
		}

		function getUser() {

			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}
			return $http({
				url: twwmConfig.authEndpoint + '/api/user',
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + token
				}
			});
			
		}

		function storeUser(res) {

			function isAdmin(authorities) {

				var adminRole = _.findIndex(authorities, function (auth) {
					return auth.authority === "ROLE_ADMIN"
				});

				if (adminRole !== -1)
					return true;
				else
					return false;
			}

			$rootScope.currentUser.accessToken = localStorageService.get('access_token');
			$rootScope.currentUser.refreshToken = localStorageService.get('refresh_token');

			getUser()
				.then(function (res) {
					$rootScope.currentUser.lat = res.data.latitude;
					$rootScope.currentUser.lng = res.data.longitude;
					$rootScope.currentUser.locationPermission = res.data.locationPermission;
					$rootScope.currentUser.isAdmin = isAdmin(res.data.authorities);
					$rootScope.currentUser.territoryCode = res.data.territoryCode;
					$rootScope.currentUser.username = res.data.username;
					$rootScope.currentUser.firstName = res.data.firstName;
					$rootScope.currentUser.lastName = res.data.lastName;
					$rootScope.currentUser.photoUrl = res.data.photoUrl;
				})
				.catch(function (err) {
					console.log(err);
				});


		}

		function getUserDetails(username) {
			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}
			return $http({
				url: twwmConfig.authEndpoint + '/api/user/' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + token
				}
			});
		}

		function getLatLng() {
			var latLng = [];

			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}

			function error(err) {
				console.log(err);
				ResponseService.error(err);
			}


			if (localStorageService.get('user_lat') == null) {

				var getObj = {
					method: 'GET',
					url: twwmConfig.authEndpoint + '/api/user',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}

					$http(getObj)
					.then(function (res) {

						$rootScope.currentUser.lat = res.data.latitude;
						$rootScope.currentUser.lng = res.data.longitude;

						latLng.push(res.data.latitude);
						latLng.push(res.data.longitude);
						setLatLng(latLng[0], latLng[1]);
						return latLng;
					})
					.catch(error);

			} else {
				$rootScope.currentUser.lat = localStorageService.get('user_lat');
				$rootScope.currentUser.lng = localStorageService.get('user_lng');

				latLng.push(Number(localStorageService.get('user_lat')));
				latLng.push(Number(localStorageService.get('user_lng')));
				return latLng;
			}

			if(latLng.length === 0){
				return [0, 0];
			}
			
		}

		function setLatLng(lat, lng) {
			if (lat) {
				localStorageService.set('user_lat', lat);
			}
			if (lng) {
				localStorageService.set('user_lng', lng);
			}
		}
	}

})();