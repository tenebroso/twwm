(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', '$rootScope', 'UserService', 'AuthService', 'MediaService', 'ResponseService', 'GDoSService'];

    function ProfileController($state, $rootScope, UserService, AuthService, MediaService, ResponseService, GDoSService) {
    	var vm = this;

    	vm = {
    		filename: '',
    		getTerritories: getTerritories,
    		getLatLongOfUser: getLatLongOfUser,
			logout: logout,
    		setPreference: setPreference,
			territories:[],
    		updateUser: updateUser,
    		uploadPhoto: uploadPhoto
    	}

    	if (AuthService.hastoken()) {
    		UserService.getUser().then(function (res) {
    			var user = res.data;
    			vm.getLatLongOfUser(user);

    			if (user.firstName === "First Name")
    				user.firstName = '';
    			if (user.lastName === "Last Name")
    				user.lastName = '';

    			vm.user = user;
    		}).catch(error);
    	} else {
    		$state.go('login');
    	}

    	$rootScope.hideLoading();

    	vm.getTerritories();

    	return vm;

    	function getLatLongOfUser(user) {
    		if (!user || !user.locationSharing) {
    			return;
    		} else if (user.locationSharing && "geolocation" in navigator) {
    			return navigator.geolocation.getCurrentPosition(function (success) {
    				user.latitude = success.coords.latitude;
    				user.longitude = success.coords.longitude;
    			}, function (error) {
    				console.log(error);
    			});
    		}
    	}

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

        function setPreference(pref) {
        	if (vm.user[pref]) {
        		vm.user[pref] = false;
        	} else {
        		vm.user[pref] = true;
        	}
        }

        function logout() {
        	AuthService.logout();
        	console.clear();
        }

        function error(err) {
        	ResponseService.error(err);
        }

        function success(response) {
        	console.log(response);
        	$rootScope.hideLoading();
        }

        function uploadPhoto(file) {

        	if (!file) {
        		return;
        	}

        	var tags = "twwm-profilePhoto";
        	var options = {
        		width:200,
        		height:200,
        		quality:.8,
        		type: 'image/jpeg',
        		centerCrop: true
        	}

        	MediaService
				.resize(file, options)
				.then(MediaService.convert)
				.then(function (res) {
					$rootScope.addLoading();
					return MediaService.createObj(res, file.name, tags)
				})
				.then(MediaService.uploadMedia)
				.then(function (res) {
					if(res.data.uploaderUsername === vm.user.username)
						vm.user.photoUrl = res.data.fullUrl;
					updateUser();

					$rootScope.hideLoading();
        		}).catch(function(err){
        			ResponseService.error(err, 'There was a problem uploading your photo. Please make sure it is less than 1000x1000 pixels and a JPG Image');
        			$rootScope.hideLoading();
        		});
        }

        function updateUser() {

        	function success(res) {
        		$rootScope.hideLoading();

        		$rootScope.response = {
        			title: 'Success',
        			body: 'Your profile has been updated!'
        		}

        		$.magnificPopup.open({
        			items: {
        				src: '#msgDialog',
        				type: 'inline'
        			},
        			callbacks: {
        				close: function () {
        					delete $rootScope.response.title;
        					delete $rootScope.response.body;
        				}
        			}
        		});
        	}

        	$rootScope.addLoading();

        	delete vm.user.password;

        	console.log(vm.user);

        	UserService.updateUser(vm.user)
                .then(success)
				.catch(error);
        }

    }

})();