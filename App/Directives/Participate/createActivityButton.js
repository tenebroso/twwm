(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmNewactivity', function () {
			return {
				templateUrl: "App/Templates/Participate/newActivityButton.tpl.html",
				link: function (scope, el, attr) {
					el.bind('click', function () {
						document.querySelector('.flyout').classList.remove('isClosed');
					})
				}
			};
		});
})();