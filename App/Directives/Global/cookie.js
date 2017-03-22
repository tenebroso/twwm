(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmCookie', ['$cookies', function ($cookies) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/cookie.tpl.html",
				link: function (scope, el, attr) {

					scope.cookieAccepted = false;

					if ($cookies.get('cookieAccepted')) {
						scope.cookieAccepted = true;
					}

					el.find('.js-closeCookie').on('click', function () {
						console.log('clicked');
						scope.$apply(function () {
							scope.cookieAccepted = true;
						});

						$cookies.put('cookieAccepted', 'true');
					})

				}
			}
		}]);
})();