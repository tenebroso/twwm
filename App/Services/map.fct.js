 (function () {
	'use strict';

	angular
        .module('app')
        .factory('MapService', MapService);

	MapService.$inject = ['$rootScope', '$http', '$state', '$timeout', 'twwmConfig', 'localStorageService', 'NgMap', 'UserService', 'ResponseService'];
	function MapService($rootScope, $http, $state, $timeout, twwmConfig, localStorageService, NgMap, UserService, ResponseService) {
		var mapService = this;
		var count = 1;

		mapService = {
			bounds: {},
			createMap: createMap,
			createPin: createPin,
			getPins: getPins,
			googleMapsUrl: 'https://maps.googleapis.com/maps/api/js?key=' + twwmConfig.googleApiKey,
			populateMap: populateMap,
			pins: []
		}


		return mapService;

		function getPins(page, latLng, kms) {
			if (!page) {
				page = '0';
			}
			if (!kms || kms == 0) {
				kms = '500'
			}
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/pins/radius/' + latLng[0] + '/' + latLng[1] + '/' + kms + '/' + page,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getPrayers(page) {
			if (!page) {
				page = '0';
			}
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/pray/all/' + page,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getPrayerComments(prayerId) {
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/comments/prayer/' + prayerId,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getMorePins(count, latLng, kms) {
			//var activities = [];
			var poi = [];
			getPins(count, latLng, kms)
				.then(function (pinResults) {

					var updatedPoi = _.uniqBy(pinResults.data.content.filter(function (v) {
						return v.location.lat !== 0;
					}), 'location.lat');

					_.forEach(updatedPoi, function (poi) {
						$rootScope.poi.push(poi);
					});

					if (!pinResults.data.last && count <= 2) {
						count++;
						//$timeout(function () {
							getMorePins(count, latLng, kms);
						//}, 2000);
					} else {
						//NgMap.getMap().then(function (map) {
						//	var markers = [];
						//	for (var i = 0; i < $rootScope.poi.length; i++) {

						//		var tempLatLng = new google.maps.LatLng($rootScope.poi[i].location.lat, $rootScope.poi[i].location.lon);
						//		var marker = new google.maps.Marker({
						//			position: tempLatLng
						//		});
						//		markers.push(marker);
								
						//	}

						//});
						$rootScope.hideLoading();
						console.timeEnd("dropPins");
					}
				});
		}

		function createMap() {
			var activities = [];
			var poi = [];

			if ($rootScope.lat == 'undefined') {
				UserService.getLatLng();
			}

			count = 1;
			populateMap();
		}

		function createPin(title, contentId, contentClass, lat, lng) {

			var postObject = {
				"actionCount": 0,
				"actioned": true,
				"id": "",
				"identity": {
					"contentClass": contentClass,
					"contentId": contentId
				},
				"location": {
					"lat": lat || 0,
					"lon": lng || 0
				},
				"title": title
			}

			return $http({
				method: 'POST',
				url: twwmConfig.contentEndpoint + '/pins/create/',
				data: postObject,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function dropPins(map) {
			console.time("dropPins");
			$rootScope.addLoading();
			mapService.bounds = map.getBounds();
			var start = mapService.bounds.getNorthEast();
			var end = mapService.bounds.getSouthWest();
			var center = map.getCenter();
			var latLng = [center.lat(), center.lng()];
			var distStart = Number(google.maps.geometry.spherical.computeDistanceBetween(center, start) / 1000.0);
			var distEnd = Number(google.maps.geometry.spherical.computeDistanceBetween(center, end) / 1000.0);
			var distance = distStart + distEnd;

			getPins('0', latLng, distance.toFixed(0))
				.then(function (pinResults) {
					$rootScope.poi = _.uniqBy(pinResults.data.content.filter(function (v) {
						// make sure that the lat long doesn't already exist in the array
						// create script to add content to qa, then remove it - add slight adjustments to lat/long
						return v.location.lat !== 0;
					}), 'location.lat');
					

					//$rootScope.hideLoading();
					//console.timeEnd("dropPins");
					$timeout(function () {
						getMorePins(count, latLng, distance.toFixed(0));
						//$rootScope.hideLoading();
					}, 500);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
				});
		}

		function populateMap() {

			var dynMarkers = [];

			NgMap.getMap().then(function (map) {

				var lat = $rootScope.lat || UserService.getLatLng()[0];
				var long = $rootScope.lng || UserService.getLatLng()[1];
				mapService.bounds = new google.maps.LatLngBounds();

				if (lat === 0 && long === 0 && navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						var pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						map.setCenter(pos);
						map.setZoom(6);
					}, function () {
						var pos = {
							lat: Number('51.511630'),
							lng: Number('-0.098140')
						};
						map.setCenter(pos);
						map.setZoom(6);
					});
				} else if (lat !== 0 && long !== 0) {
					var pos = {
						lat: lat,
						lng: long
					};
					map.setCenter(pos);
					map.setZoom(6);
				} else {
					var pos = {
						lat: Number('51.511630'),
						lng: Number('-0.098140')
					};
					map.setCenter(pos);
					map.setZoom(6);
				}

				dropPins(map);

				
				var isIdle = false;

				map.addListener('idle', function () {
					window.setTimeout(function () {
						isIdle = true;
					}, 1000);
				});

				map.addListener('dragstart', function () {
					isIdle = false;
				});

				map.addListener('dragstart', function () {
					isIdle = false;
				});

				google.maps.event.addListener(map, 'bounds_changed', function () {
					$rootScope.addLoading();
					var bounds = map.getBounds();
					if (mapService.bounds === bounds) {
						$rootScope.hideLoading();
						return;
					} else {
						mapService.bounds = bounds;
						dropPins(map);
					}


				//	var start = bounds.getNorthEast();
				//	var end = bounds.getSouthWest();
				//	var center = map.getCenter();
				//	var latLng = [center.lat(),center.lng()];
				//	var distStart = Number(google.maps.geometry.spherical.computeDistanceBetween(center, start) / 1000.0);
				//	var distEnd = Number(google.maps.geometry.spherical.computeDistanceBetween(center, end) / 1000.0);
				//	var distance = distStart + distEnd;
				//	console.log(latLng, distance);

				//	getPins('0', latLng, distance.toFixed(0))
				//		.then(function (pinResults) {
				//			var activities = [];
				//			var poi = [];
				//			poi = activities = pinResults.data.content;
				//			$rootScope.pins = activities;
				//			$rootScope.poi = poi.filter(function (v) { return v.location.lat !== 0; });
				//		})
				//		.catch(function (err) {
				//			console.log(err);
				//			ResponseService.error(err);
				//		});
					
					

				});

				//map.addListener('dragend', function () {
				//	// 3 seconds after the center of the map has changed, pan back to the
				//	// marker.
					
					
				//	window.setTimeout(function () {
				//		console.log(isIdle);
				//		if (!isIdle) {
				//			return;
				//		}
				//		console.log('center changed');

				//		var latLng = [map.center.lat(), map.center.lng()];
				//		var activities = [];
				//		var poi = [];

				//		getPins('0', latLng)
				//				.then(function (pinResults) {

				//					poi = activities = pinResults.data.content;

				//					$rootScope.pins = activities;
				//					$rootScope.poi = poi.filter(function (v) { return v.location.lat !== 0; });

				//					//populateMap();
				//					//if (!pinResults.data.last) {
				//					//	$timeout(getMorePins, 100);
				//					//}

				//				})
				//				.catch(function (err) {

				//					console.log(err);
				//					ResponseService.error(err);

				//				})
				//				.finally(function () {

				//					$rootScope.hideLoading();

				//				});
				//	}, 2000);
				//});

			}).catch(function (err) {
				console.log(err);
				ResponseService.error(err);
			});
			

				
			
		}

	}

})();