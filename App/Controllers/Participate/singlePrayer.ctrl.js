(function () {
	'use strict';

	angular
        .module('app')
        .controller('SinglePrayerController', SinglePrayerController);

	SinglePrayerController.$inject = ['$rootScope', '$state', '$http', '$location', 'twwmConfig', 'PrayerService', 'UserService', 'ResponseService', 'MapService'];
	function SinglePrayerController($rootScope, $state, $http, $location, twwmConfig, PrayerService, UserService, ResponseService, MapService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			submitResponse: submitResponse,
			response: '',
			commentTools: {
				id:false
			},
			removeComment: removeComment,
			reportComment:reportComment,
			isResponding: false,
			fullUrl: $location.absUrl(),
			content: {},
			getPrayer: getPrayer,
			flagPrayer: flagPrayer,
			loggedInUsername: $rootScope.currentUser.username,
			removePrayer: removePrayer,
			toggleParticipation: toggleParticipation
		}

		vm.getPrayer();

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
			PrayerService.createComment(id, $rootScope.currentUser.username, $.trim(vm.response))
				.then(function (res) {
					getPrayer();
					$rootScope.hideLoading();
					vm.isResponding = false;
					console.log(res);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function getResponses(id) {
			PrayerService.retrieveComments(id)
				.then(function (res) {
					vm.content.comments = res.data;

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
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId, prayerId) {
			$rootScope.addLoading();
			PrayerService.deleteComment(commentId)
				.then(function (res) {
					PrayerService.getPrayer(prayerId);
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId, prayerId) {
			$rootScope.addLoading();
			PrayerService.flagComment(commentId)
				.then(function (res) {
					PrayerService.getPrayer(prayerId);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removePrayer(id) {
			$rootScope.addLoading();

			PrayerService.remove(id)
				.then(function (res) {
					$state.go('participate.pray');
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}


		function getPrayer() {
			var prayerId = $state.params.prayerId;

			PrayerService.getPrayer(prayerId)
				.then(function (res) {

					vm.content = res.data;

					//getResponses(vm.content.id);

					angular.forEach(vm.content.comments, function (comment) {
						comment.active = true;
						comment.created = comment.posted;

						UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
					});
					
					if (vm.content.anonymous) {

						vm.content.title = 'Anonymous';
						delete vm.content.photoUrl;

					} else {
						UserService.getUserDetails(vm.content.username)
							.then(function (res) {
								vm.content.title = res.data.firstName + ' ' + res.data.lastName.charAt(0) + '.';
								if (res.data.photoUrl !== '/Content/Images/camera-white@2x.png')
									vm.content.photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								console.log(err);
							})
					}

				})
				.catch(function (err) {
					console.log(err);
				});

		}


		function flagPrayer(id) {
			$rootScope.addLoading();
			PrayerService.flag(id)
				.then(function(res){
					console.log(res);
					getPrayer();
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
			PrayerService.join(id)
				.then(function (res) {
					if (res.data.success) {
						getPrayer();
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
			PrayerService.leave(id)
				.then(function (res) {
					if (res.data.success) {
						getPrayer();
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

	}

})();