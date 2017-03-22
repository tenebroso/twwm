(function () {
	'use strict';

	angular
        .module('app')
        .controller('SingleActivityController', SingleActivityController);

	SingleActivityController.$inject = ['$rootScope', '$state', '$location', 'ActivityService', 'UserService', 'ResponseService', 'MapService', 'CommentService'];
	function SingleActivityController($rootScope, $state, $location, ActivityService, UserService, ResponseService, MapService, CommentService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			submitResponse: submitResponse,
			response: '',
			commentTools: {
				id: false
			},
			fullUrl: $location.absUrl(),
			removeComment: removeComment,
			reportComment: reportComment,
			isResponding: false,
			content: {},
			loggedInUsername: $rootScope.currentUser.username,
			getActivity: getActivity,
			removeActivity: removeActivity,
			toggleParticipation: toggleParticipation
		}

		vm.getActivity();

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
			var type = 'activity.' + vm.content.type;
			CommentService.create(id, $rootScope.currentUser.username, $.trim(vm.response), type)
				.then(function (res) {
					$rootScope.hideLoading();
					vm.isResponding = false;
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.remove(commentId)
				.then(function (res) {
					getActivity();
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.flag(commentId)
				.then(function (res) {
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function getActivity() {
			var activityId = $state.params.activityId;
			$rootScope.addLoading();
			ActivityService.getActivity(activityId)
				.then(function (res) {
					
					vm.content = res.data;
					vm.content.type = 'mobilize';
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

					$rootScope.hideLoading();

				})
				.catch(function (err) {
					console.log(err);
				});
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
			ActivityService.join(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
						MapService.createMap();
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
			ActivityService.leave(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
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

		function removeActivity(id) {
			ActivityService.remove(id)
				.then(function (res) {
					if (res.status === 200) {

						if ($rootScope.response) {
							$rootScope.response.title = 'Success!';
							$rootScope.response.body = 'Your activity has been deleted';
						} else {
							$rootScope.response = {
								title: 'Success!',
								body: 'Your activity has been deleted'
							}
						}


						$.magnificPopup.open({
							items: {
								src: '#msgDialog',
								type: 'inline'
							},
							callbacks: {
								close: function () {
									delete $rootScope.response.title;
									delete $rootScope.response.body;
									MapService.createMap();
									$state.go('participate.mobilise');
								}
							}
						});
					}
				})
				.catch(function (err) {
					ResponseService.error(' You do not have the authority to delete this activity.');
				});
		}

	}

})();