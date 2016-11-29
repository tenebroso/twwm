(function () {
	'use strict';

	angular
		.module('homePanelFour', ['youtube-embed'])
		.directive('homePanelFour', function ($http) {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelFour.tpl.html",
				link: function (scope, el, attr) {

					scope.playerVars = {
						controls: 0,
						autoplay: 1,
						rel: 0,
						showinfo: 0,
						loop:1
					};

					$http({
						method: "GET",
						url: '//migration.salvationarmy.org/mobilize_endpoint/homePanelFour/json'
					}).success(function (data) {
						scope.panelFour = data;

						scope.$on('youtube.player.ready', function ($event, player) {
							player.mute();
						});
						
						scope.$on('youtube.player.ready', function ($event, player) {

							player.mute();

							if ($(window).width() < 767) {
								$('.tv iframe').addClass('active');
							} else {
								var w = $(window).width() + 200;
								var h = $(window).height() + 200;
								$('.tv iframe').addClass('active');
								if (w / h > 16 / 9) {
									player.setSize(w, w / 16 * 9);
									$('.tv iframe').css({ 'left': '0px' });
								} else {
									player.setSize(h / 9 * 16, h);
									$('.tv iframe').css({ 'left': -($('.tv iframe').outerWidth() - w) / 2 });
								}
							}
							
						});

						scope.$on('youtube.player.ended', function ($event, player) {
							player.playVideo();
						});

					});
				}
			};
		});
})();