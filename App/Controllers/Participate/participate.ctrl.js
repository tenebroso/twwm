(function () {
	'use strict';

	angular
        .module('app')
        .controller('ParticipateController', ParticipateController);

	ParticipateController.$inject = ['$scope', '$rootScope', '$http', '$state', 'UserService', 'MediaService', 'AuthService', 'MapService', 'twwmConfig', 'localStorageService'];
	function ParticipateController($scope, $rootScope, $http, $state, UserService, MediaService, AuthService, MapService, twwmConfig, localStorageService) {
		var vm = this;

		vm = {
			clickHandler: clickHandler,
			getLatLongOfUser: getLatLongOfUser,
			getSingleActivity: getSingleActivity,
			googleMapsUrl: MapService.googleMapsUrl,
			pins: $rootScope.pins,
			pinMouseover: pinMouseOver,
			pinMouseout: pinMouseOut,
			setActiveState:setActiveState,
			dynMarkers: [],
			userLat: 0,
			userLong: 0,
			username: $rootScope.currentUser.username
		}

		//if (!AuthService.hastoken()) {
			//$state.go('login');
			//return;
		//}

		$scope.$on('$stateChangeStart', function () {
			closeFlyout();
		});

		$scope.$on('$stateChangeSuccess', function () {
			openFlyout();
			$rootScope.hideLoading();
		});

		if (vm.userLat === 0 || vm.userLong === 0) {
			vm.getLatLongOfUser();
		}

		MapService.createMap();

		return vm;

		function setActiveState(activity, id) {

			if ($state.current.name === 'participate.pray' && activity === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'mobilise') && activity === 'org.salvationarmy.mobilize.content.domain.activity.Mobilize') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'read') && activity === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'reach') && activity === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (!_.isUndefined($state.params.prayerId) && $state.params.prayerId === id) {
				return true;
			} else if (!_.isUndefined($state.params.activityId) && $state.params.activityId === id) {
				return true;
			} else if (!_.isUndefined($state.params.evangelismId) && $state.params.evangelismId === id) {
				return true;
			} else {
				return false;
			}
		}

		function getSingleActivity(id, type) {
			
			if (type === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$state.go('participate.prayer', { prayerId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.activity.Evangelism') {
				$state.go('participate.evangelism', { evangelismId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$state.go('participate.readItem', { urlAlias: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$state.go('participate.reachItem', { urlAlias: id });
			} else {
				$state.go('participate.activity', { activityId: id });
			}
		}

		function pinMouseOver() {
			angular.element(this)[0].classList.add('hovered');
			angular.element(this)[0].style.cursor = 'pointer';
		}

		function pinMouseOut() {
			angular.element(this)[0].classList.remove('hovered');
			angular.element(this)[0].style.cursor = '';
		}

		function clickHandler(event, id, type) {
			
			$('.custom-marker').removeClass('enlarged');
			angular.element(this).addClass('enlarged');

			if (type === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$state.go('participate.prayer', { prayerId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.activity.Evangelism') {
				$state.go('participate.evangelism', { evangelismId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$state.go('participate.readItem', { urlAlias: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$state.go('participate.reachItem', { urlAlias: id });
			} else {
				$state.go('participate.activity', { activityId: id });
			}
			
		}

		function openFlyout() {
			var flyout = document.querySelector('.flyout');
			flyout.classList.remove('isClosed');				
		}

		function closeFlyout() {
			var flyout = document.querySelector('.flyout');
			flyout.classList.add('isClosed');
		}

		function getLatLongOfUser() {

			if (!$rootScope.currentUser.locationPermission) {
				return false
			} else if ($rootScope.currentUser.locationPermission && "geolocation" in navigator) {
				return navigator.geolocation.getCurrentPosition(function (success) {
					$rootScope.currentUser.lat = vm.userLat = success.coords.latitude;
					$rootScope.currentUser.lng = vm.userLong = success.coords.longitude;
					UserService.setLatLng(vm.userLat, vm.userLong);
					console.log(vm.userLat, vm.userLong);
				}, function (error) {
					$rootScope.currentUser.lat = vm.userLat = UserService.getLatLng()[0] || 0;
					$rootScope.currentUser.lng = vm.userLong = UserService.getLatLng()[1] || 0;

					console.log(vm.userLat, vm.userLong, error, 'error');
				});
			}
		}

	}

})();