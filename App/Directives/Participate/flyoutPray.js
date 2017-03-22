(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmPray', ['$http', '$rootScope', 'twwmConfig', 'UserService', 'ResponseService', 'PrayerService', 'MapService', 'localStorageService', function ($http, $rootScope, twwmConfig, UserService, ResponseService, PrayerService, MapService, localStorageService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmPray.tpl.html",
				scope: false,
				controllerAs: 'prayVm',
				controller: function () {
					var prayVm = this;

					prayVm = {
						archives: [],
						createPrayer: createPrayer,
						getArchive: getArchive,
						isCreating: false,
						newPrayer: {},
						startCreating: startCreating,
						stopCreating: stopCreating,
						username: $rootScope.currentUser.username,
						users:[]
					}

					if (_.isEmpty($rootScope.currentUser)) {
						UserService.getUser()
							.then(UserService.storeUser)
							.catch(ResponseService.error);
					}

					$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
						prayVm.newPrayer.username = prayVm.username = $rootScope.currentUser.username;
						prayVm.newPrayer.photoUrl = $rootScope.currentUser.photoUrl;
					});
						

					prayVm.getArchive();

					return prayVm;

					function startCreating(type) {
						prayVm.newPrayer.type = type;
						prayVm.isCreating = true;
					}

					function stopCreating() {
						prayVm.isCreating = false;
						prayVm.postalCode = '';
						prayVm.newPrayer.date = '';

						if (prayVm.newPrayer.location) {
							delete prayVm.newPrayer.location;
						}
						if (prayVm.newPrayer.date) {
							delete prayVm.newPrayer.date;
						}
					}

					function getArchive() {
						console.time('getArchive');
						$http({
							method: "GET",
							url: twwmConfig.contentEndpoint + '/pray/all/0',
							headers: {
								'Authorization': 'Bearer ' + UserService.getToken()
							}
						}).then(function (response) {
							prayVm.archives = _.orderBy(response.data.content, 'posted', 'desc');
							
							getArchiveDetails();
						}).catch(function (err) {
							console.log(err);
							ResponseService.error(err);
						});
					}

					function getArchiveDetails() {

						angular.forEach(prayVm.archives, function (prayer, i) {

							if (prayer.anonymous) {
								return;
							}

							UserService.getUserDetails(prayer.username)
								.then(function (res) {
									prayVm.archives[i].firstName = res.data.firstName;
									prayVm.archives[i].lastName = res.data.lastName;
								})
								.catch(function (err) {
									console.log(err);
									ResponseService.error(err);
								});
						});

						//console.timeEnd('getArchive');
					}

					function createPrayer() {

						$rootScope.addLoading();

						if (!prayVm.newPrayer.location) {
							var latLng = UserService.getLatLng();

							prayVm.newPrayer.location = {
								lat: latLng[0],
								lon: latLng[1]
							}
						}
						

						if (!_.isNull(prayVm.newPrayer.date)) {
							var date = new Date(prayVm.newPrayer.date);
							prayVm.newPrayer.posted = date.toUTCString();
						} else {
							prayVm.newPrayer.posted = $rootScope.createTimeStamp();
						}

						PrayerService.create(prayVm.newPrayer)
							.then(function (response) {
								
								var lat = response.data.location.lat || UserService.getLatLng()[0];
								var lng = response.data.location.lon || UserService.getLatLng()[1];
								MapService.createPin(response.data.type, response.data.identity.contentId, response.data.identity.contentClass, lat, lng)
								.then(function (res) {
									console.log(res);
									getArchive();
									MapService.createMap();
									stopCreating();
								})
								.catch(function (err) {
									console.log(err);
								});

								

							}).catch(function (err) {
								console.log(err);
								ResponseService.error(err);
							})
							.finally(function () {
								$rootScope.hideLoading();
							});
					}


				}
			};
		}]);
})();