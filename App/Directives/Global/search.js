(function () {
	'use strict';

	angular
		.module('app')
		.directive('search', function () {
			return {
				templateUrl: "App/Templates/Global/search.tpl.html",
				link: function (scope, el, attr) {

					if (scope.placeText)
						return;
				
					if(attr.type == "events")
						scope.placeText = "Search Events";
					else
						scope.placeText = "Search Blog";
					
					var form = el.context;
					var closeIcon = form.querySelector('.search-clear');
					var inputField = form.querySelector('.search-input');
					
					closeIcon.addEventListener('click', function () {
						inputField.value = '';
					});

				}
			};
		});
})();