(function () {
	'use strict';

	angular
        .module('app')
        .factory('PrayerService', PrayerService);

	PrayerService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService', 'UserService'];
	function PrayerService($rootScope, $http, twwmConfig, localStorageService, UserService) {

		var NewPrayer = {
			"actionCount": 0,
			"actioned": false,
			"anonymous": false,
			"body": "",
			"campaign": {
				"id": twwmConfig.campaignId,
				"name": twwmConfig.campaignName
			},
			"id": "",
			"identity": {
				"contentClass": "",
				"contentId": ""
			},
			"location": {
				"lat": 0,
				"lon": 0
			},
			"photoUrl": "", // This stores the prayer author's profile photo at the time of posting
			"posted": "", // This date is now coming from the controller
			"reported": false,
			"reportedDate": "",
			"reportingUser": "",
			"responses": [],
			"urgent": false,
			"type":0,
			"username": ""
		}

		var prayerService = {
			create: create,
			createComment: createComment,
			retrieveComments: retrieveComments,
			deleteComment: deleteComment,
			flagComment: flagComment,
			getPrayer: getPrayer,
			flag: flag,
			join: join,
			leave: leave,
			remove: remove
		}

		return prayerService;

		function create(prayer) {

			delete prayer.date;

			var newPrayer = Object.assign({}, NewPrayer, prayer);

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/pray',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: newPrayer
			});

		}

		function createComment(id, username, body) {

			var comment = {
				"body": body,
				"posted": $rootScope.createTimeStamp(),
				"username": username
			}

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: comment
			});

		}

		function retrieveComments(id) {
			return $http({
				method: "GET",
				url: twwmConfig.contentEndpoint + '/comments/prayer/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function deleteComment(id) {
			return $http({
				method: "DELETE",
				url: twwmConfig.contentEndpoint + '/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flagComment(id) {
			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/report/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/report/prayer/' + id,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/prayer/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/prayer/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function getPrayer(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}


	}


})();