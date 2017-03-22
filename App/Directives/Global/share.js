(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmShare', ['$http', 'twwmConfig', 'ResponseService', 'localStorageService', '$window', function ($http, twwmConfig, ResponseService, localStorageService, $window) {
			return {
				restrict: 'A',
				link: function (scope, el, attrs) {

					var src = '';

					$(el).on('click', function () {

						$(this).addClass('isSharing');

						$http({
							method: 'POST',
							data: '',
							url: twwmConfig.contentEndpoint + '/share/' + attrs.type + '/' + attrs.id,
							headers: {
								'authorization': 'Bearer ' + localStorageService.get('access_token')
							}
						})
						.then(function (res) {
							console.log(res);
						})
						.catch(function (err) {
							ResponseService.error(err);
							console.log(err);
						});

					});
				}
			};
		}])
		.directive('fbLike', [
          '$window', '$rootScope', function ($window, $rootScope) {
          	return {
          		restrict: 'A',
          		scope: {
          			fbLike: '=',
          			fbPhoto: '='
          		},
          		link: function (scope, element, attrs) {
          			if (location.hash === '#!/blog') {
          				scope.fbLike = location.href + '/' + scope.fbLike;

          			} else {
          				scope.fbLike = location.href;
          			}

          			if (!$window.FB) {
          				// Load Facebook SDK if not already loaded
          				$.getScript('//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1975865475974072', function () {
          					$window.FB.init({
          						appId: '1975865475974072',
          						xfbml: true,
          						version: 'v2.8'
          					});
          					
          					renderLikeButton();
          				});
          			} else {
          				renderLikeButton();
          			}

          			var watchAdded = false;
          			function renderLikeButton() {
          				if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
          					// wait for data if it hasn't loaded yet
          					watchAdded = true;
          					var unbindWatch = scope.$watch('fbLike', function (newValue, oldValue) {
          						if (newValue) {
          							renderLikeButton();

          							// only need to run once
          							unbindWatch();
          						}

          					});
          					return;
          				} else {
          					element.html('<a class="facebook-shareBtn">Share</a>');
          					element.bind('click', openDialog);

          					function openDialog() {
          						$window.FB.ui({
          							method: 'share',
          							display: 'popup',
          							href: scope.fbLike,
									picture:scope.fbPhoto
          						}, function (response) { });
          					}
          				}
          			}
          		}
          	};
          }
		])

      .directive('tweet', [
          '$window', '$location',
          function ($window, $location) {
          	return {
          		restrict: 'A',
          		scope: {
          			tweet: '=',
          			tweetUrl: '='
          		},
          		link: function (scope, element, attrs) {

					if(!scope.tweetUrl)
						scope.tweetUrl = attrs.tweetUrl;

					if (!scope.tweet)
						scope.tweet = attrs.tweet;

          			if (!$window.twttr) {
          				$.getScript('//platform.twitter.com/widgets.js', function () {
          					renderTweetButton();
          				});
          			} else {
          				renderTweetButton();
          			}

          			var watchAdded = false;

          			function renderTweetButton() {
          				scope.$watch('tweetUrl', function (newValue, oldValue) {
          						element.html('<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + scope.tweet + '" data-url="' + scope.tweetUrl + '">Tweet</a>');
          						$window.twttr.widgets.load(element.parent()[0]);
          				});
          			}

          		}
          	};
          }
      ]);
})();