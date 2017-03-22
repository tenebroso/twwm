(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmGetlatlongfromzip', ['$http', function ($http) {
			return {
				controller: ['$http', '$scope', function ($http, $scope) {
					var geo = this;

					geo = {
						geocodeZip: geocodeZip
					}

					return geo;

					function geocodeZip(zip) {
						return $http({
							url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&sensor=true',
							method: 'GET',
							headers: {
								'Authorization': undefined,
								'Access-Control-Allow-headers': undefined,
								'AccessControlAllowHeaders': undefined
							}
						});
					}


				}],
				controllerAs: 'geo',
				scope: false,
				link: function (scope, el, attr, geo) {
					var element = el.context;

					function getLatLong() {
						if (this.value.length >= 5) {
							scope.addLoading();
							var val = $.trim(this.value);

							geo.geocodeZip(val)
								.then(function (res) {
									if (res.status === 200 && res.data && res.data.results && res.data.results.length > 0) {
										console.log(res.data.results[0]);
										if (scope.vm.user) {
											scope.vm.user.latitude = res.data.results[0].geometry.location.lat;
											scope.vm.user.longitude = res.data.results[0].geometry.location.lng;
										} else if (scope.prayVm && scope.prayVm.newPrayer) {
											scope.prayVm.newPrayer.location = {};
											scope.prayVm.newPrayer.location.lat = res.data.results[0].geometry.location.lat;
											scope.prayVm.newPrayer.location.lon = res.data.results[0].geometry.location.lng;
											console.log(scope.prayVm.newPrayer);
										}
										
									}
								})
								.catch(function (err) {
									console.log(err);
									scope.vm.user.latitude = 0;
									scope.vm.user.longitude = 0;
								})
								.finally(function () {
									scope.hideLoading();
								});

						}
					}
					
					//element.addEventListener('keyup', _.throttle(getLatLong, 1000));
					element.addEventListener('keypress', _.throttle(getLatLong, 1000));

				}
			};
		}]);
})();