(function () {
	'use strict';

	angular
        .module('app')
        .controller('TimeCtrl', TimeCtrl);

	TimeCtrl.$inject = ['$rootScope','$interval'];
	function TimeCtrl($rootScope, $interval) {
		var tick = function () {
			$rootScope.clock = moment(new Date).format("LTS");
		}
		tick();
		$interval(tick, 1000);

		return;
	}

})();