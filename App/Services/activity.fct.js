(function () {
	'use strict';

	angular
        .module('app')
        .factory('ActivityService', ActivityService);

	ActivityService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService'];
	function ActivityService($rootScope, $http, twwmConfig, localStorageService) {

		var lat = 0;
		var lon = 0;

		var Marker = {
			"activity": {},
			"created": "string",
			"id": "string",
			"location": {
				"lat": lat,
				"lon": lon
			},
			"username": "string"
		}

		var date = new Date();

		var Activity = {
				"actionCount": 0,
				"actioned": true,
				"active": true,
				"activityType": {
					"id": "string",
					"name": "string"
				},
				"campaign": {
					"id": twwmConfig.campaignId,
					"name": twwmConfig.campaignName
				},
				"complete": true,
				"completed": "", // Date Completed if Multi-Day Activity is False, this is set to created date?
				"created": date.toUTCString(), // Current timestamp
				"description": "",
				"duration": "",
				"endLocation": {
					"lat": lat,
					"lon": lon
				},
				"id": "",
				"identity": {
					"contentClass": "",
					"contentId": ""
				},
				"joinable": true,
				"paused": "",
				"privateActivity": false,
				"route": [],
				"start": "string", // Projected start date
				"startLocation": {
					"lat": lon,
					"lon": lon
				},
				"started": "", //Date route track started
				"title": "",
				"updated": "",
				"username": ""
		}

		var activityService = {
			create: create,
			join: join,
			leave: leave,
			remove: remove,
			getActivity: getActivity,
			getActivities: getActivities,
			getLatLong: getLatLong
		}

		return activityService;

		function getLatLong(address) {

			return $http({
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + twwmConfig.googleApiKey,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'AccessControlAllowHeaders':undefined,
					'Access-Control-Allow-headers': undefined
				}
			});

		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/mobilize/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/mobilize/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function create(activity) {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return;
			}

			var newActivity = Object.assign({}, Activity, activity);
			
			if (newActivity.title === "" || newActivity.username === "") {
				return false;
			} else {
				return $http({
					url: twwmConfig.contentEndpoint + '/mobilize',
					method: 'POST',
					data: newActivity,
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivity(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivities(page) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/all/' + page,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}


	}


})();