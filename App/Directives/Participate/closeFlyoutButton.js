(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmFlyoutclose', function () {
			return {
				restrict: 'E',
				replace: true,
				template: '<div class="u-floatRight flyoutHeader__close"><i class="dn-icon-mobilise-close"><span class="path1"></span><span class="path2"></span></i></div>',
				link: function (scope, el, attr) {


					el.bind('click', function () {

						if (scope.vm && scope.vm.step && scope.vm.step === 4) {
							scope.vm.step = 1;
							scope.vm.clearActivityDetails();
						}

						var parent = document.querySelector('.flyout');
						var classList = parent.classList.value;
						var result = classList.indexOf('isClosed');
						
						$('.custom-marker').removeClass('enlarged');

						if (result === -1) {
							parent.classList.add('isClosed');
						} else {
							parent.classList.remove('isClosed');
						}

					});
				}
			};
		});
})();