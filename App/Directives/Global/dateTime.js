(function () {
	'use strict';

	angular
		.module('app')
		.directive('dateTime', ['$interval', function ($interval) {
			return {
				templateUrl: "App/Templates/Global/dateTime.tpl.html",
				link: function (scope, el, attr) {

					var tick = function () {
						scope.clock = moment(new Date).format("LTS");
					}

					tick();

					$interval(tick, 1000);

					return;

				}
			};
		}]);
})();