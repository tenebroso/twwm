(function () {
	'use strict';

	if (typeof Object.assign != 'function') {
		Object.assign = function (target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		};
	}

	angular
        .module('app', ['ui.router', 'ngAnimate', 'angularMoment', 'home', 'LocalStorageModule', 'ngFileUpload', 'ngMap', 'angularTrix', 'ngCookies'])
        .config(config)
        .run(run)
		.filter('unsafe', ['$sce', function ($sce) {
			return function (val) {
				return $sce.trustAsHtml(val);
			};
		}])
		.filter('limitWord', function () {

			function limitWord(text, limit, moreChar) {
				var limitedText = text.trim().split(' ');
				if (limitedText.length < limit) {
					return text;
				} else {
					limitedText = text.trim().split(' ', limit);
					text = limitedText.join(' ');
					return text + moreChar;
				}
			}

			return function(text,limit,moreChar){
				limit = parseInt(limit) || 8;
				moreChar = moreChar || ' ...';
				return limitWord(text,limit, moreChar);
			}
		})
		.constant('twwmConfig', {

			// STAGING URLS
				//'authEndpoint': 'https://qa-auth.mobilising-api.org/uaa',
				//'contentEndpoint': 'https://qa-content.mobilising-api.org',
				//'loggingEndpoint': 'https://dsstest.satruck.org/apiservices/log/twwm/logweberror',
				//'logreportEndpoint': 'https://dsstest.satruck.org/ApiServices/Log/Twwm/GetLog',

			// LIVE URLS
				'contentEndpoint': 'https://content.mobilising-api.org',
				'authEndpoint': 'https://auth.mobilising-api.org/uaa',
				'loggingEndpoint': 'https://satruck.org/apiservices/log/twwm/logweberror',
				'logreportEndpoint': 'https://satruck.org/ApiServices/Log/Twwm/GetLog',

			'publicEndpoint': 'https://webmanager.salvationarmy.org/mobilize_endpoint',
			'campaignId': 'twwm',
			'campaignName': 'The Whole World Mobilising',
			'googleApiKey': 'AIzaSyB816lc6G9ifoCDGhLrSsfqJxA6WTvLhlA'
		});

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider'];
	function config($stateProvider, $urlRouterProvider, $compileProvider) {

		$compileProvider.debugInfoEnabled(false);

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				templateUrl: 'App/Templates/Home/home.tpl.html',
				controllerAs: 'vm'
			})
			.state('blog', {
				abstract: true,
				url: '/blog',
				templateUrl: 'App/Templates/Blog/blog.tpl.html',
				controller: 'BlogController',
				controllerAs: 'vm'
			})
			.state('blog.index', {
				url: '',
				templateUrl: 'App/Templates/Blog/index.tpl.html'
			})
			.state('blog.post', {
				url: '/:postUrl',
				templateUrl: 'App/Templates/Blog/index.tpl.html'
			})
			.state('events', {
				abstract: true,
				url: '/events',
				templateUrl: 'App/Templates/Events/events.tpl.html',
				controller: 'EventsController',
				controllerAs: 'vm'
			})
			.state('events.index', {
				url: '',
				templateUrl: 'App/Templates/Events/index.tpl.html'
			})
			.state('events.event', {
				url: '/:postUrl',
				templateUrl: 'App/Templates/Events/index.tpl.html'
			})
			.state('contact', {
				url: '/contact',
				params: {
					pageName: 'contactUs',
				},
				controller: 'PageController',
				templateUrl: 'App/Templates/Global/page.tpl.html',
				controllerAs: 'vm'
			})
			.state('about', {
				url: '/about',
				params: {
					pageName: 'aboutUs',
				},
				controller: 'PageController',
				templateUrl: 'App/Templates/Global/page.tpl.html',
				controllerAs: 'vm'
			})
			.state('privacyPolicy', {
				url: '/privacy_policy',
				params: {
					pageName: 'privacyPolicy',
				},
				controller: 'PageController',
				templateUrl: 'App/Templates/Global/page.tpl.html',
				controllerAs: 'vm'
			})
			.state('login', {
				url: '/login',
				controller: 'LoginController',
				templateUrl: 'App/Templates/Account/login.tpl.html',
				controllerAs: 'vm'
			})
			.state('register', {
				url: '/register',
				controller: 'RegisterController',
				templateUrl: 'App/Templates/Account/register.tpl.html',
				controllerAs: 'vm'
			})
			.state('resetPassword', {
				url: '/resetpassword/:token',
				controller: 'LoginController',
				templateUrl: 'App/Templates/Account/resetpassword.tpl.html',
				controllerAs: 'vm'
			})
			.state('profile', {
				url: '/profile',
				controller: 'ProfileController',
				templateUrl: 'App/Templates/Account/profile.tpl.html',
				controllerAs: 'vm'
			})
			.state('activities', {
				url: '/activities',
				controller: 'ActivitiesController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Account/activities.tpl.html'
			})
			.state('participate', {
				abstract: true,
				url: '/participate',
				controller: 'ParticipateController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/participate.tpl.html'
			})
			.state('participate.index', {
				url: '/read',
				templateUrl: 'App/Templates/Participate/read.tpl.html'
			})
			.state('participate.readItem', {
				url: '/read/:urlAlias',
				controller: 'ReadReachController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/readItem.tpl.html'
			})
			.state('participate.mobilise', {
				url: '/mobilise',
				templateUrl: 'App/Templates/Participate/mobilise.tpl.html'
			})
			.state('participate.activity', {
				url: '/mobilise/:activityId',
				controller: 'SingleActivityController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/activity.tpl.html'
			})
			.state('participate.evangelism', {
				url: '/evangelism/:evangelismId',
				controller: 'SingleEvangelismController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/activity.tpl.html'
			})
			.state('participate.reach', {
				url: '/reach',
				templateUrl: 'App/Templates/Participate/reach.tpl.html'
			})
			.state('participate.reachItem', {
				url: '/reach/:urlAlias',
				controller: 'ReadReachController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/reachItem.tpl.html'
			})
			.state('participate.connect', {
				url: '/connect',
				templateUrl: 'App/Templates/Participate/connect.tpl.html'
			})
			.state('participate.pray', {
				url: '/pray',
				templateUrl: 'App/Templates/Participate/pray.tpl.html'
			})
			.state('participate.prayer', {
				url: '/pray/:prayerId',
				controller: 'SinglePrayerController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/prayer.tpl.html'
			})
			.state('participate.new', {
				url: '/new',
				controller: 'CreateActivityController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Participate/addNewFlyout.tpl.html'
			})
			.state('dashboard', {
				url: '/dashboard',
				controller: 'DashboardController',
				templateUrl: 'App/Templates/Dashboard/dashboard.tpl.html',
				controllerAs: 'vm'
			})
			.state('admin', {
				abstract: true,
				url: '/admin',
				controller: 'AdminController',
				templateUrl: 'App/Templates/Admin/index.tpl.html',
				controllerAs: 'vm'
			})
			.state('admin.index', {
				url: '/logs',
				controller: 'LogsController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Admin/logs.tpl.html',
			})
			.state('admin.read', {
				url: '/read',
				controller: 'ProvidedContentAdminController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Admin/content.tpl.html',
			})
			.state('admin.reach', {
				url: '/reach',
				controller: 'ProvidedContentAdminController',
				controllerAs: 'vm',
				templateUrl: 'App/Templates/Admin/content.tpl.html',
			});

	}

	run.$inject = ['$rootScope', '$state', '$timeout', '$http', '$location', '$window'];
	function run($rootScope, $state, $timeout, $http, $location, $window) {

		// Populated in the Authority Factory when the user is logged in
		$rootScope.currentUser = {}

		// The pins on the map itself
		$rootScope.poi = [];
		
		$rootScope.toggleMobileNav = function (el) {
			var nav = angular.element(document.querySelector('#nav-primary'));
			if (nav.hasClass('opened')) {
				nav.removeClass('opened');
			} else if($(window).width() < 991) {
				nav.addClass('opened');
			}
		}

		$http.defaults.headers.common.Authorization = 'Basic bW9iaWxpemU6R2hpazlHYTVI';
		$http.defaults.headers.common.AccessControlAllowHeaders = 'Authorization';

		$rootScope.addLoading = function () {
			document.body.classList.add('loading');
		}

		$rootScope.hideLoading = function () {
			document.body.classList.remove('loading');
		}

		$rootScope.createTimeStamp = function(startDate, startTime) {

			if (!startDate || !startTime) {
				var date = new Date();
				return date.toUTCString();
			}

			var dateParts = startDate.toString().split(' 00:00:00');
			var timeParts = startTime.toString().split('1970 ');

			if (dateParts && timeParts) {
				var newDate = new Date(dateParts[0] + ' ' + timeParts[1]);
				return newDate.toUTCString();
			}
		}

		$rootScope.orderByDate = function (items, type) {
			if (type === 'pins') {
				return _.orderBy(items, ['start'], ['desc']);
			} else if (type === 'providedContent') {
				return _.orderBy(items, ['publishDate'], ['desc'])
			} else {
				return items;
			}
		}

		$rootScope.removePrivate = function (items) {
			return items.filter(function (item) {
				return item.privateActivity === false;
			});
		}

		$rootScope.$on('$stateChangeStart', function () {
			$rootScope.addLoading();
			$('.navbar-nav').removeClass('opened');
		});

		$rootScope.$on('$stateChangeSuccess', function () {
			$window.ga('send', 'pageview', $location.path());
			$window.ga('TWWMWebApp.send', 'pageview', $location.path());
		});
	}

})();