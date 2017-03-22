(function () {
	'use strict';

	angular
        .module('app')
        .controller('CreateActivityController', CreateActivityController);

	CreateActivityController.$inject = ['$rootScope', '$state', 'EvangelismService', 'ActivityService', 'UserService', 'ResponseService', 'MapService'];
	function CreateActivityController($rootScope, $state, EvangelismService, ActivityService, UserService, ResponseService, MapService) {

		var vm = this;
		var newActivityButtons = Array.from(document.querySelectorAll('.newActivity__option'));

		vm = {
			activity: {
				activityType: {

				},
				startLocation: {
					lat: 0,
					lon:0
				},
				username: ''
			},
			address: {

			},
			addedActivity: {},
			multipleDay: false,
			start: {
				date: '',
				time:''
			},
			isEvangelism:false,
			step: 1,
			clearActivityDetails: clearActivityDetails,
			createActivity: createActivity,
			moveBack: moveBack,
			setActivityType: setActivityType,
			validateActivityStep: validateActivityStep,
			validationErrorMsg: ''
		}

		$rootScope.hideLoading();

		return vm;

		function getUsername() {
			if (_.isEmpty($rootScope.currentUser)) {
				UserService.getUser()
					.then(UserService.storeUser)
					.catch(ResponseService.error);
			} else {
				vm.activity.username = $rootScope.currentUser.username;
			}

			$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
				vm.activity.username = $rootScope.currentUser.username;
			});
		}

		function createActivity() {

			if (vm.start.date && vm.start.time) {
				createActivityTimeStamp();
			} else {
				vm.validationErrorMsg = 'Please double check that you have added your time and date correctly.';
				return;
			}

			if (vm.activity.username == 'undefined') {
				getUsername();
			}
			
			$rootScope.addLoading();

			if (vm.activity.activityType.name === "Evangelism") {
				EvangelismService.create(vm.activity)
				.then(function (res) {
					var activityId = res.data.id;

					if (!vm.activity.privateActivity) {
						MapService.createPin(res.data.title, res.data.id, res.data.identity.contentClass, res.data.startLocation.lat, res.data.startLocation.lon)
							.then(function (res) {
								ResponseService.success('Your Evangelism Event was Saved!');
								vm.step = 4;
								MapService.createMap();
								$state.go('participate.evangelism', { evangelismId: activityId });
							})
							.catch(function (err) {
								console.log(err);
								ResponseService.error(err);
								$state.reload();
							});
					} else {
						ResponseService.success('Your Evangelism Event was Saved!');
						vm.step = 4;
						$state.go('participate.evangelism', { evangelismId: activityId });
					}

				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$state.reload();
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
			} else {
				ActivityService.create(vm.activity)
				.then(function (res) {
					var activityId = res.data.id;

					if (!vm.activity.privateActivity) {
						MapService.createPin(res.data.title, res.data.id, res.data.identity.contentClass, res.data.startLocation.lat, res.data.startLocation.lon)
						.then(function (res) {
							ResponseService.success('Your Activity was Saved!');
							vm.step = 4;
							MapService.createMap();
							$state.go('participate.activity', { activityId: activityId });
						})
						.catch(function (err) {
							console.log(err);
							ResponseService.error(err);
							$state.reload();
						});
					} else {
						ResponseService.success('Your Activity was Saved!');
						vm.step = 4;
						$state.go('participate.activity', { activityId: activityId });
					}

				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$state.reload();
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
			}

		}

		function clearActivityDetails() {
			$state.go('participate.mobilise');
		}

		function moveBack() {
			if(vm.step !== 1)
				vm.step--;
		}

		function validateActivityStep() {
			
			if (vm.step === 1) {

				getUsername();

				if (vm.activity.activityType.id) {
					vm.validationErrorMsg == '';
					vm.step++;
					return;
				} else {
					vm.validationErrorMsg = 'Please click on an activity above to proceed.';
					return;
				}
			}

			if (vm.step === 2) {
				vm.validationErrorMsg == '';
				if (vm.address.city && vm.address.state && vm.activity.title) {
					vm.validationErrorMsg == '';
					$rootScope.addLoading();
					getLatLong()
						.then(setLatLong)
						.catch(function (err) {
							ResponseService.error(err);
							console.log(err);
						})
						.finally(function () {
							$rootScope.hideLoading();
						});

					vm.step++;
					return;
				} else {
					vm.validationErrorMsg = 'Please ensure that you have filled out the required fields.';
					$.each($('input[required]'), function (i, item) {
						if ($(item).val() === "") {
							$(item).addClass('invalid');
						} else {
							$(item).removeClass('invalid');
						}
					});
					return;
				}
			}

			if (vm.step === 3) {

				if (vm.activity.activityType.id && vm.start.date !== '') {
					createActivity();
				} else {
					vm.validationErrorMsg = 'Please double check that you have added your time and date correctly.';
					return;
				}
				
			}
	
		}

		function getLatLong(add) {
			var add = vm.address.line1 + ' ' + vm.address.city + ' ' + vm.address.state + ' ' + vm.address.postalCode;
			return ActivityService.getLatLong(add);
		}

		function setLatLong(res) {

			vm.activity.startLocation.lat = 0;
			vm.activity.startLocation.lon = 0;

			if (res && res.data && res.data.results.length > 0 && res.data.results[0].geometry.location.lat && res.data.results[0].geometry.location.lng) {
				vm.activity.startLocation.lat = res.data.results[0].geometry.location.lat;
				vm.activity.startLocation.lon = res.data.results[0].geometry.location.lng;
				vm.validationErrorMsg == '';
			} else {
				ResponseService.error('Unfortunately we could not verify that address. Please try again');
				return;
			}
			
			return vm.activity;
		}

		function setMultiDay() {
			if (vm.multipleDay) {
				vm.activity.completed = vm.activity.started;
			}
		}

		function createActivityTimeStamp() {

			var dateParts = vm.start.date.toString().split(' 00:00:00');
			var timeParts = vm.start.time.toString().split('1970 ');

			if (dateParts && timeParts) {
				var newDate = new Date(dateParts[0] + ' ' + timeParts[1]);
				vm.activity.start = newDate.toUTCString();
			}
		}

		function setActivityType(event) {

			vm.validationErrorMsg = '';

			for (var i = 0; i < newActivityButtons.length; i++) {
				newActivityButtons[i].classList.remove('selected');
			}
			event.currentTarget.classList.add('selected');
			vm.activity.activityType.id = event.currentTarget.dataset.id;
			vm.activity.activityType.name = event.currentTarget.innerText;

			if (vm.activity.activityType.id === "15") {
				setupEvangelismType();
			} else {
				clearEvangelismType();
			}
		}

		function clearEvangelismType() {
			delete vm.activity.attendance;
			delete vm.activity.seekers;
			vm.isEvangelism = false;
		}


		function setupEvangelismType() {
			vm.isEvangelism = true;
			vm.activity.attendance = 0;
			vm.activity.seekers = 0;
		}

	}

})();