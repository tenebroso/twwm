(function () {
	'use strict';

	angular
        .module('app')
        .factory('EvangelismService', EvangelismService);

	EvangelismService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService'];
	function EvangelismService($rootScope, $http, twwmConfig, localStorageService) {

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

		var EvangelismActivity = {
			"actionCount": 0,
			"actioned": true,
			"active": true,
			"activityType": {
				"id": "string",
				"name": "string"
			},
			"attendance":0,
			"campaign": {
				"id": twwmConfig.campaignId,
				"name": twwmConfig.campaignName
			},
			"complete": true,
			"created": date.toUTCString(), // Current timestamp
			"description": "",
			"id": "",
			"identity": {
				"contentClass": "",
				"contentId": ""
			},
			"privateActivity": false,
			"seekers":0,
			"start": "string", // Projected start date
			"startLocation": {
				"lat": lon,
				"lon": lon
			},
			"started": "", //Date route track started
			"story":"",
			"title": "",
			"updated": "",
			"username": ""
		}

		var evangelismService = {
			create: create,
			join: join,
			leave: leave,
			remove: remove,
			getActivity: getActivity,
			getActivities: getActivities,
			getLatLong: getLatLong
		}

		return evangelismService;

		function getLatLong(address) {

			return $http({
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + twwmConfig.googleApiKey,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Allow-headers': undefined
				}
			});

		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/evangelism/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/evangelism/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function create(evangelismActivity) {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return;
			}

			var newEvangelismActivity = Object.assign({}, EvangelismActivity, evangelismActivity);

			console.log(newEvangelismActivity);

			if (newEvangelismActivity.title === "" || newEvangelismActivity.username === "") {
				return false;
			} else {
				return $http({
					url: twwmConfig.contentEndpoint + '/evangelism',
					method: 'POST',
					data: newEvangelismActivity,
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivity(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivities(page) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/all/' + page,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}


	}


})();