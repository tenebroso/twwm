(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmFlyoutOpen', function () {
			return {
				restrict: 'A',
				link: function (scope, el, attr) {

					el.bind('click', function () {

						var parent = document.querySelector('.flyout');
						var classList = parent.classList.value;
						var result = classList.indexOf('isClosed');

						if (result !== -1) {
							parent.classList.remove('isClosed');
						}

					});
				}
			};
		});
})();