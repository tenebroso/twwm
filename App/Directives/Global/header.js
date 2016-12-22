(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmHeader', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/header.tpl.html",
				controller:["$state", "$scope", function($state, $scope){
					var vm = this;
					vm.isShown = true;
					$scope.$on('$stateChangeSuccess', function () {
						if ($state.current.name === "home") {
							vm.isShown = false;
							angular.element('body').addClass('home');
							console.log(vm);
						} else {
							angular.element('body').removeClass('home');
						}
					});
					return vm;
				}],
				controllerAs:"vm"
			};
		});
})();