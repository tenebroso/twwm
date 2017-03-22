(function () {
	'use strict';

	angular
        .module('app')
        .controller('ReadReachController', ReadReachController);

	ReadReachController.$inject = ['$rootScope', '$state', '$location', 'ProvidedContentService', 'UserService', 'ResponseService', 'MapService', 'CommentService'];
	function ReadReachController($rootScope, $state, $location, ProvidedContentService, UserService, ResponseService, MapService, CommentService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			commentTools: {
				id: false
			},
			content: {},
			flagItem: flagItem,
			fullUrl:$location.absUrl(),
			getItem: getItem,
			remove: remove,
			removeComment: removeComment,
			reportComment: reportComment,
			response: '',
			submitResponse: submitResponse,
			toggleParticipation: toggleParticipation,
			type: $state.current.name === "participate.readItem" ? 'read' : 'reach'
		}

		vm.getItem();

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

		function addResponse() {
			vm.isResponding = true;
		}

		function submitResponse(id) {
			$rootScope.addLoading();
			var type = vm.type === 'reach' ? 'Outreach' : 'Reading';

			CommentService.create(id, $rootScope.currentUser.username, $.trim(vm.response), type)
				.then(function (res) {
					$rootScope.hideLoading();
					vm.isResponding = false;
					getItem();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId) {
			$rootScope.addLoading();
			CommentService.remove(commentId)
				.then(function (res) {
					getItem();
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId) {
			$rootScope.addLoading();
			CommentService.flag(commentId)
				.then(function (res) {
					getItem();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function readSuccess(response) {

			$.each(response.data.content, function (i, v) {
				var postPublishDate = moment(v.publishDate, moment.ISO_8601);
				if (moment(new Date(), moment.ISO_8601).isBefore(postPublishDate)) {
					response.data.content[i].published = false;
				}
			});

			return response.data.content;

		}

		function getItem() {
			var urlAlias = $state.params.urlAlias;
			ProvidedContentService.getSingle(vm.type, urlAlias)
				.then(function (response) {
					vm.content = response.data;
					if (vm.content.comments.length > 0) {
						angular.forEach(vm.content.comments, function (comment) {
							UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
						});
					}
				})
				.catch(function(err){
					console.log(err);
					ResponseService.error(err);
				})
				.finally($rootScope.hideLoading);
		}

		function flagItem(id) {
			$rootScope.addLoading();
			ProvidedContentService.flag(vm.type, id)
				.then(function (res) {
					console.log(res);
					getItem();
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function toggleParticipation(id, bool) {
			if (bool && bool == true) {
				leaveActivity(id);
			} else {
				joinActivity(id);
			}
		}

		function joinActivity(id) {
			$rootScope.addLoading();
			ProvidedContentService.join(vm.type, id)
				.then(function (res) {
					var lat = UserService.getLatLng()[0];
					var lng = UserService.getLatLng()[1];
					if (res.data.success) {
						MapService.createPin(vm.content.title, vm.content.identity.contentId, vm.content.identity.contentClass, lat, lng)
							.then(function (res) {
								console.log(res);
								getItem();
								MapService.createMap();
							})
							.catch(function (err) {
								console.log(err);
							});
						
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

		function leaveActivity(id) {
			$rootScope.addLoading();
			ProvidedContentService.leave(vm.type, id)
				.then(function (res) {
					if (res.data.success) {
						getItem();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function remove(id) {
			$rootScope.addLoading();

			ProvidedContentService.remove(tag, id)
				.then(function (res) {
					$state.go('participate.' + vm.type);
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

	}

})();