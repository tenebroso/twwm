(function () {
	'use strict';

	angular
        .module('app')
        .controller('ProvidedContentAdminController', ProvidedContentAdminController);

	ProvidedContentAdminController.$inject = ['$rootScope', '$state', '$http', 'twwmConfig', 'UserService', 'ResponseService'];
	function ProvidedContentAdminController($rootScope, $state, $http, twwmConfig, UserService, ResponseService) {

		var vm = this;

		vm = {
			create: createItem,
			currentState: $state.current.name.split('.')[1],
			editItem: editItem,
			deleteItem: deleteItem,
			get: getItems,
			isEditing:false,
			item: {
				"actionCount": 0,
				"actioned": false,
				"author": $rootScope.currentUser.username || 'TWWMContentTeam',
				"body": "",
				"campaign": {
					"id": twwmConfig.campaignId,
					"name": twwmConfig.campaignName
				},
				"flagged": false,
				"id": "",
				"publishDate": "",
				"title": ""
			},
			items: [],
			reset:reset
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (newValue, oldValue) {
			if (!_.isUndefined(newValue)) {
				vm.item.author = newValue;
			}
		});

		vm.get();

		$rootScope.hideLoading();

		return vm;

		function editItem(item) {
			if (!item) {
				console.log('no item');
			}
			vm.isEditing = true;
			vm.item = item.item;
		}

		function getItems() {
			$rootScope.addLoading();
			$http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/' + vm.currentState + '/all/0/1000',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				vm.items = $rootScope.orderByDate(res.data.content, 'providedContent');
				angular.forEach(vm.items, function (v) {
					v.publishDate = new Date(v.publishDate);
				});
			})
			.catch(function (err) {
				console.log(err);
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function createItem() {
			$rootScope.addLoading();
			$http({
				method: 'POST',
				data: vm.item,
				url: twwmConfig.contentEndpoint + '/' + vm.currentState,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				vm.get();
				reset();
			})
			.catch(function (err) {
				console.log(err);
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function deleteItem(id) {
			$rootScope.addLoading();
			$http({
				method: 'DELETE',
				url: twwmConfig.contentEndpoint + '/' + vm.currentState + '/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				getItems();
				reset();
			})
			.catch(function (err) {
				ResponseService.error(err, 'There was a problem deleting this post. Please try again later.');
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function reset() {
			document.getElementById("contentCreator").reset();
			vm.item.id = "";
			vm.isEditing = false;
		}


	}

})();