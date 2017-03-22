(function () {
	'use strict';

	angular
        .module('app')
        .controller('LogsController', LogsController);

	LogsController.$inject = ['$rootScope', '$scope', '$state', '$http', 'twwmConfig', 'UserService', 'ResponseService'];
	function LogsController($rootScope, $scope, $state, $http, twwmConfig, UserService, ResponseService) {
		var vm = this;

		vm = {
			getErrors: getErrors,
			errorRequest: {
				"StartDateUtc": "01/01/2017",
				"EndDateUtc": moment().format('MM/DD/YYYY').toString(),
				"PageSize": 10,
				"PageNum": 0,
				"SortDirection": "DESC",
				"SortColumn": "EventTime",
				"WorkstationNameFilter": "",
				"ApplicationVersionFilter": "",
				"ApplicationFilter": "",
				"ModuleFilter": "",
				"MethodFilter": "",
				"UsernameFilter": "",
				"HttpStatusFilter": "",
				"HttpErrorFilter": ""
			},
			errors: [],
			nextErrors: next,
			pageNum:0,
			prevErrors: prev,
			sortType: 'EventTime',
			sortReverse: true
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		vm.getErrors();

		$scope.count = 1;

		return vm;

		

		function prev() {
			if (vm.errorRequest.PageNum === 0) {
				getErrors(0);
			} else {
				$scope.count = vm.errorRequest.PageNum;
				var num = $scope.count - 1;
				getErrors(num);
			}
		}

		function next() {
			var num = $scope.count++;

			getErrors(num);
		}

		function getErrors(page) {
			
			$rootScope.addLoading();
			if (_.isUndefined(page)) {
				page = 0;
			}

			vm.errorRequest.PageNum = page;

			$.ajax({
				"async": true,
				"crossDomain": true,
				"url": twwmConfig.logreportEndpoint,
				"method": "POST",
				"headers": {
					"content-type": "application/json"
				},
				"processData": false,
				"data": JSON.stringify(vm.errorRequest)
			})
			.done(function (res) {
				
				vm.errors = res.RetVal.filter(function (item) {
					return item.Username !== 'uf.ajdeaton@gmail.com';
				});

				$rootScope.hideLoading();
			})
			.fail(function (err) {
				$rootScope.hideLoading();
			});


		}


	}

})();