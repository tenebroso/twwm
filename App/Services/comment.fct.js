(function () {
	'use strict';

	angular
        .module('app')
        .factory('CommentService', CommentService);

	CommentService.$inject = ['$rootScope', '$http', 'twwmConfig', 'UserService'];
	function CommentService($rootScope, $http, twwmConfig, UserService) {

		var commentService = {
			create: create,
			get: get,
			remove: remove,
			flag: flag
		}

		return commentService;

		function create(id, username, body, type) {

			if (!type || !id || !username || !body)
				return;

			// type = Prayer, 

			var comment = {
				"active": true,
				"body": body,
				"created": $rootScope.createTimeStamp(),
				"id": "",
				"identity": {
					"contentClass": "",
					"contentId": ""
				},
				"location": {
					"lat": $rootScope.currentUser.lat,
					"lon": $rootScope.currentUser.lng
				},
				"locationId": "",
				"reported": false,
				"reportedDate": "",
				"reportingUser": "",
				"targetEntity": {
					"contentClass": "org.salvationarmy.mobilize.content.domain." + _.upperFirst(type),
					"contentId": id
				},
				"username": username
			}

			console.log(comment);

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/comment',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: comment
			});

		}

		function get(id, type) {
			if (!type || !id)
				return;

			return $http({
				method: "GET",
				url: twwmConfig.contentEndpoint + '/comments/' + type + '/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(id) {
			return $http({
				method: "DELETE",
				url: twwmConfig.contentEndpoint + '/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(id) {
			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/report/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}


	}


})();