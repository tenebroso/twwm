(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmGeocodezip', ['$http', function ($http) {
			return {
				controller: ['$http', '$scope', function ($http, $scope) {
					var geo = this;
					var vm = $scope.vm;

					geo = {
						geocodeZip: geocodeZip,
						setFormFields: setFormFields
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

					function setFormFields(components) {
						vm.address.postalCode = components.postalCode;
						if(components.country){
							vm.address.country = components.country;
						}
						if (components.locality) {
							vm.address.city = components.locality;
						}
						if (components.administrative_area_level_1) {
							vm.address.state = components.administrative_area_level_1
						}
					}
					
				}],
				controllerAs: 'geo',
				scope:false,
				link: function (scope, el, attr, geo) {
					var element = el.context;
					element.addEventListener('keyup', function () {
						if (this.value.length >= 5) {
							var val = $.trim(this.value);
							geo.geocodeZip(val)
								.then(function (res) {
									if (res.status === 200 && res.data && res.data.results && res.data.results.length > 0) {
										
										var address_components = res.data.results[0].address_components;
										var components = {};
										$.each(address_components, function (k, v1) {
											$.each(v1.types, function (k2, v2) {
												components[v2] = v1.long_name
											});
										})
									}
									components.postalCode = val;
									return components;
								})
								.then(geo.setFormFields)
								.catch(function(err){
									console.log(err)
								});
						}
					});

				}
			};
		}]);
})();