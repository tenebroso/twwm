(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmConnect', ['$http', 'twwmConfig', 'UserService', 'ReadService', 'ResponseService', function ($http, twwmConfig, UserService, ReadService, ResponseService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmConnect.tpl.html",
				scope: false,
				controllerAs: 'connectVm',
				controller: function () {
					var connectVm = this;

					connectVm = {
						fbFeed: ''
					}
					
					return connectVm;
					
				},
				link: function (scope, el, attr, readVm) {
					
				}
			};
		}]);
})();