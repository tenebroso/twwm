(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmFooter', ['$cookies', function ($cookies) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/footer.tpl.html",
				link: function (scope, el, attr) {

					scope.footerClosed = false;

					if ($cookies.get('footerClosed')) {
						scope.footerClosed = true;
					}

					el.find('.js-closeFooter').on('click', function () {
						scope.$apply(function () {
							scope.footerClosed = true;
						});
						
						$cookies.put('footerClosed', 'true');
					})
				}
			}
		}]);
})();