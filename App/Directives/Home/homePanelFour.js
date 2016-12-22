(function () {
	'use strict';

	angular
		.module('homePanelFour', ['youtube-embed'])
		.directive('twwmHomePanelFour', function () {
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

					scope.$on('youtube.player.ready', function ($event, player) {

						player.mute();
						player.playVideo();

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
				}
			};
		});
})();