'use strict';

function configs($httpProvider) {
	var interceptor = function ($location, $log, $q) {
		function error(response) {
			if (response.status === 401) {
				$log.error('You are unauthorised to access the requested resource (401)');
			} else if (response.status === 404) {
				$log.error('The requested resource could not be found (404)');
			} else if (response.status === 500) {
				$log.error('Internal server error (500)');
			}
			return $q.reject(response);
		}
		function success(response) {
			//Request completed successfully
			return response;
		}
		return function (promise) {
			return promise.then(success, error);
		}
	};
	$httpProvider.interceptors.push(interceptor);
}

function runs($rootScope, PageValues) {
	$rootScope.$on('$routeChangeStart', function () {
		PageValues.loading = true;
	});
	$rootScope.$on('$routeChangeSuccess', function () {
		PageValues.loading = false;
	});
}
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
'use strict';
angular
        .module('app.run', ['ngRoute', 'ngCookies'])
        .run(run);

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http) {
	// keep user logged in after page refresh
	$rootScope.globals = $cookieStore.get('globals') || {};
	if ($rootScope.globals.currentUser) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
	}

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in and trying to access a restricted page
		var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
		var loggedIn = $rootScope.globals.currentUser;
		if (restrictedPage && !loggedIn) {
			$location.path('/login');
		}
	});
}

(function () {
	'use strict';

	angular
        .module('app')
        .factory('ActivityService', ActivityService);

	ActivityService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService'];
	function ActivityService($rootScope, $http, twwmConfig, localStorageService) {

		var lat = 0;
		var lon = 0;

		var Marker = {
			"activity": {},
			"created": "string",
			"id": "string",
			"location": {
				"lat": lat,
				"lon": lon
			},
			"username": "string"
		}

		var date = new Date();

		var Activity = {
				"actionCount": 0,
				"actioned": true,
				"active": true,
				"activityType": {
					"id": "string",
					"name": "string"
				},
				"campaign": {
					"id": twwmConfig.campaignId,
					"name": twwmConfig.campaignName
				},
				"complete": true,
				"completed": "", // Date Completed if Multi-Day Activity is False, this is set to created date?
				"created": date.toUTCString(), // Current timestamp
				"description": "",
				"duration": "",
				"endLocation": {
					"lat": lat,
					"lon": lon
				},
				"id": "",
				"identity": {
					"contentClass": "",
					"contentId": ""
				},
				"joinable": true,
				"paused": "",
				"privateActivity": false,
				"route": [],
				"start": "string", // Projected start date
				"startLocation": {
					"lat": lon,
					"lon": lon
				},
				"started": "", //Date route track started
				"title": "",
				"updated": "",
				"username": ""
		}

		var activityService = {
			create: create,
			join: join,
			leave: leave,
			remove: remove,
			getActivity: getActivity,
			getActivities: getActivities,
			getLatLong: getLatLong
		}

		return activityService;

		function getLatLong(address) {

			return $http({
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + twwmConfig.googleApiKey,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'AccessControlAllowHeaders':undefined,
					'Access-Control-Allow-headers': undefined
				}
			});

		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/mobilize/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/mobilize/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function create(activity) {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return;
			}

			var newActivity = Object.assign({}, Activity, activity);
			
			if (newActivity.title === "" || newActivity.username === "") {
				return false;
			} else {
				return $http({
					url: twwmConfig.contentEndpoint + '/mobilize',
					method: 'POST',
					data: newActivity,
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivity(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivities(page) {
			return $http({
				url: twwmConfig.contentEndpoint + '/mobilize/all/' + page,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}


	}


})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('AuthService', AuthService);

	AuthService.$inject = ['$rootScope', '$http', '$state', 'twwmConfig', 'localStorageService', 'ResponseService'];
	function AuthService($rootScope, $http, $state, twwmConfig, localStorageService, ResponseService) {

		var userObject = {
			"grant_type": "password",
			"username": "",
			"password": ""
		}

		var authService = {
			hastoken: hastoken,
			login: login,
			loginError: loginError,
			logout: logout,
			refreshToken: refreshToken,
			resetPassword: requestPasswordReset,
			setNewPassword: setNewPassword,
			storeToken: storeToken
		}


		return authService;

		function requestPasswordReset() {

			function completedPassword() {
				$rootScope.passwordMessages.instruction = 'Thank you! A password reset link has been emailed to you.';
				$rootScope.passwordMessages.complete = true;
			}

			var postObj = {
				url: twwmConfig.authEndpoint + '/api/registration/reset_request?username=' + encodeURIComponent($rootScope.email),
				method: 'GET'
			}

			$http(postObj).then(completedPassword).catch(ResponseService.error);
		}

		function setNewPassword(email, pass, token) {
			var postObj = {
				data: {
					"password": pass,
					"username": email,
					"verificationToken": token
				},
				url: twwmConfig.authEndpoint + '/api/registration/reset',
				method: 'POST'
			}

			$rootScope.addLoading();

			return $http(postObj);
		}

		function login(email, pass) {

			$rootScope.addLoading();

			userObject.username = email;
			userObject.password = pass;

			var data = $.param(userObject);

			var postObj = {
				url: twwmConfig.authEndpoint + '/oauth/token',
				data: data,
				headers:{
					'content-type': "application/x-www-form-urlencoded"
				},
				method:'POST'
			}

			return $http(postObj);

		}

		function refreshToken() {

			$rootScope.addLoading();

			var userObject = {
				"grant_type": "refresh_token",
				"refresh_token": localStorageService.get('refresh_token')
			}

			var data = $.param(userObject);

			var postObj = {
				url: twwmConfig.authEndpoint + '/oauth/token',
				data: data,
				headers: {
					'content-type': "application/x-www-form-urlencoded"
				},
				method: 'POST'
			}

			return $http(postObj);

		}

		function loginError(err) {
			ResponseService.error(err, ' Incorrect email and password combination, please try again.');
			$rootScope.hideLoading();
		}

		function storeToken(access, refresh, redirect) {

			function submit(key, val) {
				return localStorageService.set(key, val);
			}


			if (access && refresh) {
				submit('access_token', access);
				submit('refresh_token', refresh);
				if (_.isUndefined(redirect) || redirect !== false) {
					redirectAfterLogin();
				}
				return true;
			} else {
				return false;
			}
		}

		function redirectAfterLogin(path) {
			if (path)
				$state.go(path);
			else
				$state.go('participate.index');		
		}

		function logout() {

			function empty(key) {
				return localStorageService.remove(key);
			}


			empty('access_token');
			empty('refresh_token');
			empty('username');
			empty('user_lat');
			empty('user_lng');
			$rootScope.currentUser = {};
			$state.go('home');
		}

		function hastoken() {
			if (localStorageService.get('access_token') && localStorageService.get('refresh_token'))
				return true;
			else
				return false;
		}

	};

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('BlogService', BlogService);

	BlogService.$inject = ['$http', 'twwmConfig'];
	function BlogService($http, twwmConfig) {
		return function (categoryName) {

			return $http({
				url: twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'Access-Control-Allow-Origin': undefined,
					'Access-Control-Allow-headers': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Request-Headers': undefined,
					'Origin': undefined,
					'Referer': undefined
				}
			});
		};
	};

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('CommentService', CommentService);

	CommentService.$inject = ['$rootScope', '$http', 'twwmConfig', 'UserService'];
	function CommentService($rootScope, $http, twwmConfig, UserService) {

		var commentService = {
			create: create,
			get: get,
			remove: remove,
			flag: flag
		}

		return commentService;

		function create(id, username, body, type) {

			if (!type || !id || !username || !body)
				return;

			// type = Prayer, 

			var comment = {
				"active": true,
				"body": body,
				"created": $rootScope.createTimeStamp(),
				"id": "",
				"identity": {
					"contentClass": "",
					"contentId": ""
				},
				"location": {
					"lat": $rootScope.currentUser.lat,
					"lon": $rootScope.currentUser.lng
				},
				"locationId": "",
				"reported": false,
				"reportedDate": "",
				"reportingUser": "",
				"targetEntity": {
					"contentClass": "org.salvationarmy.mobilize.content.domain." + _.upperFirst(type),
					"contentId": id
				},
				"username": username
			}

			console.log(comment);

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/comment',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: comment
			});

		}

		function get(id, type) {
			if (!type || !id)
				return;

			return $http({
				method: "GET",
				url: twwmConfig.contentEndpoint + '/comments/' + type + '/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(id) {
			return $http({
				method: "DELETE",
				url: twwmConfig.contentEndpoint + '/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(id) {
			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/report/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}


	}


})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('ProvidedContentService', ProvidedContentService);

	ProvidedContentService.$inject = ['$http', 'twwmConfig', 'UserService'];
	function ProvidedContentService($http, twwmConfig, UserService) {

		var vm = this;

		vm = {
			getSingle: getSingle,
			getIndex: getIndex,
			flag: flag,
			isResponding: false,
			join: join,
			leave: leave,
			remove: remove
		}

		return vm;

		function getIndex(type, page, size) {
			if (_.isUndefined(page)) {
				page = '0';
			}
			if (_.isUndefined(size)) {
				size = '999';
			}

			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/all/' + page + '/' + size,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function getSingle(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/' + id,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/report/' + type + '/' + id,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function join(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/' + type + '/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function leave(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/' + type + '/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(type, id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/' + type + '/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

	};
})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('EvangelismService', EvangelismService);

	EvangelismService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService'];
	function EvangelismService($rootScope, $http, twwmConfig, localStorageService) {

		var lat = 0;
		var lon = 0;

		var Marker = {
			"activity": {},
			"created": "string",
			"id": "string",
			"location": {
				"lat": lat,
				"lon": lon
			},
			"username": "string"
		}

		var date = new Date();

		var EvangelismActivity = {
			"actionCount": 0,
			"actioned": true,
			"active": true,
			"activityType": {
				"id": "string",
				"name": "string"
			},
			"attendance":0,
			"campaign": {
				"id": twwmConfig.campaignId,
				"name": twwmConfig.campaignName
			},
			"complete": true,
			"created": date.toUTCString(), // Current timestamp
			"description": "",
			"id": "",
			"identity": {
				"contentClass": "",
				"contentId": ""
			},
			"privateActivity": false,
			"seekers":0,
			"start": "string", // Projected start date
			"startLocation": {
				"lat": lon,
				"lon": lon
			},
			"started": "", //Date route track started
			"story":"",
			"title": "",
			"updated": "",
			"username": ""
		}

		var evangelismService = {
			create: create,
			join: join,
			leave: leave,
			remove: remove,
			getActivity: getActivity,
			getActivities: getActivities,
			getLatLong: getLatLong
		}

		return evangelismService;

		function getLatLong(address) {

			return $http({
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + twwmConfig.googleApiKey,
				method: 'GET',
				headers: {
					'Authorization': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Allow-headers': undefined
				}
			});

		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/evangelism/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/evangelism/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function create(evangelismActivity) {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return;
			}

			var newEvangelismActivity = Object.assign({}, EvangelismActivity, evangelismActivity);

			console.log(newEvangelismActivity);

			if (newEvangelismActivity.title === "" || newEvangelismActivity.username === "") {
				return false;
			} else {
				return $http({
					url: twwmConfig.contentEndpoint + '/evangelism',
					method: 'POST',
					data: newEvangelismActivity,
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivity(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getActivities(page) {
			return $http({
				url: twwmConfig.contentEndpoint + '/evangelism/all/' + page,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}


	}


})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('FeaturedService', FeaturedService);

	FeaturedService.$inject = ['$http', 'twwmConfig'];
	function FeaturedService($http, twwmConfig) {
		return {
			getFeatured: function (categoryName) {
				var config = {
					headers: {
						'Authorization': undefined,
						'Access-Control-Allow-Origin': undefined,
						'Access-Control-Allow-headers': undefined,
						'AccessControlAllowHeaders': undefined
					}
				}
				return $http.get(twwmConfig.publicEndpoint + '/news/json/all/false/0/999?tag=' + categoryName, config).then(function (response) {
					return response;
				});
			}
		}
	};

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('GDoSService', GDoSService);

	GDoSService.$inject = ['$http', 'twwmConfig', 'localStorageService'];
	function GDoSService($http, twwmConfig, localStorageService) {

		var gdos = {
			getTerritories: getTerritories
		};

		return gdos;

		function getTerritories() {

			var token = localStorageService.get('access_token');

			if (!token || typeof token == 'undefined' || token == 'undefined') {
				return $http({
					url: 'https://public.api.gdos.salvationarmy.org/rest/validobjects/territory',
					method: 'GET',
					headers: {
						'Authorization': undefined,
						'AccessControlAllowheaders': undefined
					}
				});
			} else {
				return $http({
					url: twwmConfig.authEndpoint + '/api/gdos/territories',
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});
			}

			

		}


	};

})();
 (function () {
	'use strict';

	angular
        .module('app')
        .factory('MapService', MapService);

	MapService.$inject = ['$rootScope', '$http', '$state', '$timeout', 'twwmConfig', 'localStorageService', 'NgMap', 'UserService', 'ResponseService'];
	function MapService($rootScope, $http, $state, $timeout, twwmConfig, localStorageService, NgMap, UserService, ResponseService) {
		var mapService = this;
		var count = 1;

		mapService = {
			bounds: {},
			createMap: createMap,
			createPin: createPin,
			getPins: getPins,
			googleMapsUrl: 'https://maps.googleapis.com/maps/api/js?key=' + twwmConfig.googleApiKey,
			populateMap: populateMap,
			pins: []
		}


		return mapService;

		function getPins(page, latLng, kms) {
			if (!page) {
				page = '0';
			}
			if (!kms || kms == 0) {
				kms = '500'
			}
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/pins/radius/' + latLng[0] + '/' + latLng[1] + '/' + kms + '/' + page,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getPrayers(page) {
			if (!page) {
				page = '0';
			}
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/pray/all/' + page,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getPrayerComments(prayerId) {
			return $http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/comments/prayer/' + prayerId,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function getMorePins(count, latLng, kms) {
			//var activities = [];
			var poi = [];
			getPins(count, latLng, kms)
				.then(function (pinResults) {

					var updatedPoi = _.uniqBy(pinResults.data.content.filter(function (v) {
						return v.location.lat !== 0;
					}), 'location.lat');

					_.forEach(updatedPoi, function (poi) {
						$rootScope.poi.push(poi);
					});

					if (!pinResults.data.last && count <= 2) {
						count++;
						//$timeout(function () {
							getMorePins(count, latLng, kms);
						//}, 2000);
					} else {
						//NgMap.getMap().then(function (map) {
						//	var markers = [];
						//	for (var i = 0; i < $rootScope.poi.length; i++) {

						//		var tempLatLng = new google.maps.LatLng($rootScope.poi[i].location.lat, $rootScope.poi[i].location.lon);
						//		var marker = new google.maps.Marker({
						//			position: tempLatLng
						//		});
						//		markers.push(marker);
								
						//	}

						//});
						$rootScope.hideLoading();
						console.timeEnd("dropPins");
					}
				});
		}

		function createMap() {
			var activities = [];
			var poi = [];

			if ($rootScope.lat == 'undefined') {
				UserService.getLatLng();
			}

			count = 1;
			populateMap();
		}

		function createPin(title, contentId, contentClass, lat, lng) {

			var postObject = {
				"actionCount": 0,
				"actioned": true,
				"id": "",
				"identity": {
					"contentClass": contentClass,
					"contentId": contentId
				},
				"location": {
					"lat": lat || 0,
					"lon": lng || 0
				},
				"title": title
			}

			return $http({
				method: 'POST',
				url: twwmConfig.contentEndpoint + '/pins/create/',
				data: postObject,
				headers: {
					'Authorization': 'Bearer ' + localStorageService.get('access_token')
				}
			});
		}

		function dropPins(map) {
			console.time("dropPins");
			$rootScope.addLoading();
			mapService.bounds = map.getBounds();
			var start = mapService.bounds.getNorthEast();
			var end = mapService.bounds.getSouthWest();
			var center = map.getCenter();
			var latLng = [center.lat(), center.lng()];
			var distStart = Number(google.maps.geometry.spherical.computeDistanceBetween(center, start) / 1000.0);
			var distEnd = Number(google.maps.geometry.spherical.computeDistanceBetween(center, end) / 1000.0);
			var distance = distStart + distEnd;

			getPins('0', latLng, distance.toFixed(0))
				.then(function (pinResults) {
					$rootScope.poi = _.uniqBy(pinResults.data.content.filter(function (v) {
						// make sure that the lat long doesn't already exist in the array
						// create script to add content to qa, then remove it - add slight adjustments to lat/long
						return v.location.lat !== 0;
					}), 'location.lat');
					

					//$rootScope.hideLoading();
					//console.timeEnd("dropPins");
					$timeout(function () {
						getMorePins(count, latLng, distance.toFixed(0));
						//$rootScope.hideLoading();
					}, 500);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
				});
		}

		function populateMap() {

			var dynMarkers = [];

			NgMap.getMap().then(function (map) {

				var lat = $rootScope.lat || UserService.getLatLng()[0];
				var long = $rootScope.lng || UserService.getLatLng()[1];
				mapService.bounds = new google.maps.LatLngBounds();

				if (lat === 0 && long === 0 && navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						var pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						map.setCenter(pos);
						map.setZoom(6);
					}, function () {
						var pos = {
							lat: Number('51.511630'),
							lng: Number('-0.098140')
						};
						map.setCenter(pos);
						map.setZoom(6);
					});
				} else if (lat !== 0 && long !== 0) {
					var pos = {
						lat: lat,
						lng: long
					};
					map.setCenter(pos);
					map.setZoom(6);
				} else {
					var pos = {
						lat: Number('51.511630'),
						lng: Number('-0.098140')
					};
					map.setCenter(pos);
					map.setZoom(6);
				}

				dropPins(map);

				
				var isIdle = false;

				map.addListener('idle', function () {
					window.setTimeout(function () {
						isIdle = true;
					}, 1000);
				});

				map.addListener('dragstart', function () {
					isIdle = false;
				});

				map.addListener('dragstart', function () {
					isIdle = false;
				});

				google.maps.event.addListener(map, 'bounds_changed', function () {
					$rootScope.addLoading();
					var bounds = map.getBounds();
					if (mapService.bounds === bounds) {
						$rootScope.hideLoading();
						return;
					} else {
						mapService.bounds = bounds;
						dropPins(map);
					}


				//	var start = bounds.getNorthEast();
				//	var end = bounds.getSouthWest();
				//	var center = map.getCenter();
				//	var latLng = [center.lat(),center.lng()];
				//	var distStart = Number(google.maps.geometry.spherical.computeDistanceBetween(center, start) / 1000.0);
				//	var distEnd = Number(google.maps.geometry.spherical.computeDistanceBetween(center, end) / 1000.0);
				//	var distance = distStart + distEnd;
				//	console.log(latLng, distance);

				//	getPins('0', latLng, distance.toFixed(0))
				//		.then(function (pinResults) {
				//			var activities = [];
				//			var poi = [];
				//			poi = activities = pinResults.data.content;
				//			$rootScope.pins = activities;
				//			$rootScope.poi = poi.filter(function (v) { return v.location.lat !== 0; });
				//		})
				//		.catch(function (err) {
				//			console.log(err);
				//			ResponseService.error(err);
				//		});
					
					

				});

				//map.addListener('dragend', function () {
				//	// 3 seconds after the center of the map has changed, pan back to the
				//	// marker.
					
					
				//	window.setTimeout(function () {
				//		console.log(isIdle);
				//		if (!isIdle) {
				//			return;
				//		}
				//		console.log('center changed');

				//		var latLng = [map.center.lat(), map.center.lng()];
				//		var activities = [];
				//		var poi = [];

				//		getPins('0', latLng)
				//				.then(function (pinResults) {

				//					poi = activities = pinResults.data.content;

				//					$rootScope.pins = activities;
				//					$rootScope.poi = poi.filter(function (v) { return v.location.lat !== 0; });

				//					//populateMap();
				//					//if (!pinResults.data.last) {
				//					//	$timeout(getMorePins, 100);
				//					//}

				//				})
				//				.catch(function (err) {

				//					console.log(err);
				//					ResponseService.error(err);

				//				})
				//				.finally(function () {

				//					$rootScope.hideLoading();

				//				});
				//	}, 2000);
				//});

			}).catch(function (err) {
				console.log(err);
				ResponseService.error(err);
			});
			

				
			
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('MediaService', MediaService);

	MediaService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService', 'Upload'];
	function MediaService($rootScope, $http, twwmConfig, localStorageService, Upload) {

		var MediaService = {
			convert: convert,
			createObj: createObj,
			resize:resize,
			uploadMedia: uploadMedia
		}

		return MediaService;

		function Photo(lat, lng, file, fileName, tags){
			this.campaignId = twwmConfig.campaignId;
			this.fileName = fileName == 'undefined' ? 'twwmImage' : fileName;
			this.identity = {
				contentClass:'',
				contentId:''
			}
			this.latitude = lat;
			this.longitude = lng;
			this.rawImageData = file;
			this.tags = tags == 'undefined' ? '' : tags;
		}

		function convert(file) {
			return Upload.base64DataUrl(file);
		}

		function resize(file, options) {
			return Upload.resize(file, options);
		}

		function createObj(base64String, fileName, tags) {
			var mediaObj = new Photo(0, 0, base64String, fileName, tags);
			return mediaObj;
		}

		function uploadMedia(mediaObj) {
			return Upload.http({
				url: twwmConfig.contentEndpoint + '/photos',
				data: JSON.stringify(mediaObj),
				processData: false,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token'),
					'content-type': 'application/json;charset=UTF-8',
					'cache-control': 'no-cache'
				}
			});
		}
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('Page', PageFactory);

	PageFactory.$inject = ['$http', 'twwmConfig'];
	function PageFactory($http, twwmConfig) {
		return function (slug) {
			return $http({
				url: twwmConfig.publicEndpoint + '/' + slug + '/json',
				method: 'GET',
				headers:{
					'Authorization': undefined,
					'Access-Control-Allow-Origin':undefined,
					'Access-Control-Allow-headers': undefined,
					'AccessControlAllowHeaders': undefined,
					'Access-Control-Request-Headers':undefined,
					'Origin': undefined,
					'Referer':undefined
				}
			});
		};
	};
})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('PrayerService', PrayerService);

	PrayerService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService', 'UserService'];
	function PrayerService($rootScope, $http, twwmConfig, localStorageService, UserService) {

		var NewPrayer = {
			"actionCount": 0,
			"actioned": false,
			"anonymous": false,
			"body": "",
			"campaign": {
				"id": twwmConfig.campaignId,
				"name": twwmConfig.campaignName
			},
			"id": "",
			"identity": {
				"contentClass": "",
				"contentId": ""
			},
			"location": {
				"lat": 0,
				"lon": 0
			},
			"photoUrl": "", // This stores the prayer author's profile photo at the time of posting
			"posted": "", // This date is now coming from the controller
			"reported": false,
			"reportedDate": "",
			"reportingUser": "",
			"responses": [],
			"urgent": false,
			"type":0,
			"username": ""
		}

		var prayerService = {
			create: create,
			createComment: createComment,
			retrieveComments: retrieveComments,
			deleteComment: deleteComment,
			flagComment: flagComment,
			getPrayer: getPrayer,
			flag: flag,
			join: join,
			leave: leave,
			remove: remove
		}

		return prayerService;

		function create(prayer) {

			delete prayer.date;

			var newPrayer = Object.assign({}, NewPrayer, prayer);

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/pray',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: newPrayer
			});

		}

		function createComment(id, username, body) {

			var comment = {
				"body": body,
				"posted": $rootScope.createTimeStamp(),
				"username": username
			}

			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				},
				data: comment
			});

		}

		function retrieveComments(id) {
			return $http({
				method: "GET",
				url: twwmConfig.contentEndpoint + '/comments/prayer/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function deleteComment(id) {
			return $http({
				method: "DELETE",
				url: twwmConfig.contentEndpoint + '/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flagComment(id) {
			return $http({
				method: "POST",
				url: twwmConfig.contentEndpoint + '/report/comment/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function remove(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				method: 'DELETE',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function flag(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/report/prayer/' + id,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function join(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/prayer/true',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function leave(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/status/' + id + '/prayer/false',
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function getPrayer(id) {
			return $http({
				url: twwmConfig.contentEndpoint + '/pray/' + id,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}


	}


})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('ResponseService', ResponseService);

	ResponseService.$inject = ['$rootScope', '$state', 'localStorageService', 'twwmConfig', '$http'];
	function ResponseService($rootScope, $state, localStorageService, twwmConfig, $http) {

		$rootScope.response = {
			title: 'Error',
			body: 'Sorry, there was an error.'
		}

		var service = {
			success: success,
			error: error
		};

		return service;

		function recordError(res) {

			if (res.data) {
				if (res.data.errorMessage) {
					res.data.errorText = res.data.errorMessage;
				}

				if (res.data.message) {
					res.data.errorText = res.data.message;
				}

				if (res.data.error_description) {
					res.data.errorText = res.data.error_description;
				}
			} else {
				res.data = {
					errorText:""
				}
			}

			if (!res.config) {
				res.config = {
					url:''
				}
			}		

			var data = {
				"WorkstationName": window.navigator.platform ? window.navigator.platform : '',
				"ApplicationVersion": "1.1",
				"Application": "TWWM",
				"Module": "TWWM Repository",
				"Method": $state.current.name,
				"Username": localStorageService.get('username'),
				"HttpStatus": res.status,
				"HttpError": res.statusText,
				"Path": res.config.url || "",
				"Notes": $rootScope.currentUser.territoryCode || "",
				"Generic1": $state.current.controller,
				"Generic2": $state.current.url,
				"Generic3": $state.current.templateUrl,
				"ErrorMessage": res.data.errorText || ""
			}

			var postObj = {
				method: 'POST',
				data:data,
				url: twwmConfig.loggingEndpoint
			}

			return $.post(postObj);
		}

		function success(res) {
			$rootScope.hideLoading();
		}

		function error(err, string) {

			if (typeof err == 'undefined') {
				return;
			}

			if (err.status === 401 && err.data.error == "invalid_token") {
				// Try to get a new refresh token
				if (localStorageService.get('refresh_token') != null) {

					var userObject = {
						"grant_type": "refresh_token",
						"refresh_token": localStorageService.get('refresh_token')
					}

					var data = $.param(userObject);

					var postObj = {
						url: twwmConfig.authEndpoint + '/oauth/token',
						data: data,
						headers: {
							'content-type': "application/x-www-form-urlencoded"
						},
						method: 'POST'
					}

					$http(postObj)
						.then(function (res) {

							function submit(key, val) {
								return localStorageService.set(key, val);
							}

							submit('access_token', res.data.access_token);
							submit('refresh_token', res.data.refresh_token);

							console.log('refresh token successful');
							$state.reload();
						})
						.catch(function(err){
							console.log("refresh token not successful");

							console.log(err);

							//function empty(key) {
							//	return localStorageService.remove(key);
							//}


							//empty('access_token');
							//empty('refresh_token');
							//empty('username');
							//empty('user_lat');
							//empty('user_lng');
							//$rootScope.currentUser = {};
							//$state.go('home');
						});

				} else {
					localStorageService.clearAll();
					$state.go('login');
				}
			}

			recordError(err)
					.done(function (res) {
						console.log(res);
					})
					.fail(function (res) {
						console.log(res);
					});

			if (err && err.data) {

				var errorMsg;

				if (err.data) {

					if (err.data.error === "invalid_token") {
						localStorageService.clearAll();
						$state.go('login');
						return;
					}

					if (err.data.path == '/uaa/api/registration/new') {
						errorMsg = err.data.message;
					}

					if (err.data.path == '/pray/all/0') {
						errorMsg = 'We are working on fixing an issue with the server and this will be available shortly!';
					}

					if (err.data.error_description)
						errorMsg = err.data.error_description;

					if (err.data.errorMessage)
						errorMsg = err.data.errorMessage;

					$rootScope.response.body += '<br />The message received from the server was: <br /><span class="error-text">' + errorMsg + '</span>';

					if (errorMsg == 'Bad credentials') {
						$rootScope.response.body = ' Incorrect email and password combination, please try again.';
					}
				}

			} else if(typeof err !== "string") {
					if(err.status === -1){
						$rootScope.response.body += '<br /> It looks like we are having trouble connecting to the servers.';
					}
			}

			if (typeof err === "string") {
				$rootScope.response.body += err;
			}

			$.magnificPopup.open({
				items: {
					src: '#errorDialog',
					type: 'inline'
				},
				callbacks: {
					close: function () {
						$rootScope.response.body = 'Sorry, there was an error';
					}
				}
			});

			$rootScope.hideLoading();

		}
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('SearchService', SearchService);

	SearchService.$inject = ['$http', 'twwmConfig'];
	function SearchService($http, twwmConfig) {

		var search = {
			submitSearch: submitSearch,
			getResultsLabel: getResultsLabel
		};
		return search;

		function getResultsLabel(response, term) {
			console.log(response.data.totalCount == 1);
			return response.data.totalCount + ' ' + (response.data.totalCount == 1 ? 'results' : 'result') + ' for <span class="search-term">' + term + '</span>';
		}

		function getPostType(scope) {
			return scope.postType == "Posts" ? "blog" : "events";
		}

		function submitSearch(term, scope) {
			return getResults(term, getPostType(scope));
		}

		function getResults(term, type) {

			return $http({
				url: twwmConfig.publicEndpoint + '/search/news?query=' + term + '&tags=' + type,
				method: 'GET'
			})
				.then(getResultsComplete)
				.catch(getResultsError);

			function getResultsComplete(response) {
				if (response.data.totalCount === 0) {
					return handleNoResults(response);
				} else {
					return handleResults(response);
				}
			}

			function handleNoResults(response) {
				response.data.objects.push({
					noResults: true,
					content: 'Sorry, there were no results!',
					synopsis: 'Sorry, there were no results!',
					hideInMenu: true,
					published: true
				});
				return response;
			}

			function handleResults(response) {
				$.each(response.data.objects, function (i, v) {
					var postPublishDate = moment(v.publishDate);

					// Flatten this object, since it comes back with different nesting
					response.data.objects[i] = flattenObj(response.data.objects[i]);

					// There is no author param currently, so we add this in
					response.data.objects[i].hideAuthor = true;

					// We only want to show events that are occurring after today's date
					if (moment(new Date).isBefore(postPublishDate))
						response.data.objects[i].published = false;
					else
						response.data.objects[i].published = true;
				});

				return response;
			}

			function flattenObj(object, target, prefix) {
				target = target || {};
				prefix = prefix || '';
				angular.forEach(object, function (value, key) {
					if (angular.isObject(value)) {
						flattenObj(value, target, key);
					} else {
						target[key] = value;
					}
				});
				return target;
			}

			function getResultsError(error) {
				console.log(error);
			}

		};

		
	};

})();
(function () {
	'use strict';

	angular
        .module('app')
        .factory('UserService', UserService);

	UserService.$inject = ['$rootScope', '$http', '$state', 'twwmConfig', 'localStorageService', 'AuthService', 'ResponseService'];
	function UserService($rootScope, $http, $state, twwmConfig, localStorageService, AuthService, ResponseService) {

		var User = {
			aboveThirteen: true,
			authorities: [
				{
					authority: ''
				}
			],
			corps: '',
			deviceLanguage: window.navigator.language ? window.navigator.language : '',
			deviceTimeZone: String(-(new Date().getTimezoneOffset() / 60)),
			deviceType: window.navigator.platform ? window.navigator.platform : '',
			division: '',
			enabled: true,
			firstName: 'First Name',
			ipAddress: '',
			languagePreference: 'en',
			lastName: 'Last Name',
			latitude: 0,
			locationPermission: true,
			locationSharing: true,
			longitude: 0,
			marketingVerification: true,
			mobileOs: 'web',
			photoUrl: '/Content/Images/camera-white@2x.png',
			registrationLocation: '',
			registrationMethod: 'web',
			territoryCode: '',
			username: ''
		}

		// TODO Request that FirstName and LastName be nullable

		var userService = {
			getLatLng: getLatLng,
			getToken: getToken,
			getUserDetails: getUserDetails,
			getUser:getUser,
			registerUser: registerUser,
			setLatLng: setLatLng,
			storeUser:storeUser,
			updateUser: updateUser
		}

		return userService;

		function getToken(name) {
			if (typeof name === 'string')
				return localStorageService.get(name);
			else
				return localStorageService.get('access_token');
		}


		function registerUser(user) {

			var newUser = Object.assign({}, User, user);

			var userObj = {
				data: newUser,
				method: 'POST',
				url: twwmConfig.authEndpoint + '/api/registration/new'
			}

			return $http(userObj);
		}

		function updateUser(user) {
			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}

			var userObj = {
				data:user,
				method: 'PUT',
				url: twwmConfig.authEndpoint + '/api/registration/edit',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}

			function success(response) {
				console.log(response);
			}

			function error(error) {
				console.log(error);
			}

			return $http(userObj).then(success).catch(error);
		}

		function getUser() {

			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}
			return $http({
				url: twwmConfig.authEndpoint + '/api/user',
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + token
				}
			});
			
		}

		function storeUser(res) {

			function isAdmin(authorities) {

				var adminRole = _.findIndex(authorities, function (auth) {
					return auth.authority === "ROLE_ADMIN"
				});

				if (adminRole !== -1)
					return true;
				else
					return false;
			}

			$rootScope.currentUser.accessToken = localStorageService.get('access_token');
			$rootScope.currentUser.refreshToken = localStorageService.get('refresh_token');

			getUser()
				.then(function (res) {
					$rootScope.currentUser.lat = res.data.latitude;
					$rootScope.currentUser.lng = res.data.longitude;
					$rootScope.currentUser.locationPermission = res.data.locationPermission;
					$rootScope.currentUser.isAdmin = isAdmin(res.data.authorities);
					$rootScope.currentUser.territoryCode = res.data.territoryCode;
					$rootScope.currentUser.username = res.data.username;
					$rootScope.currentUser.firstName = res.data.firstName;
					$rootScope.currentUser.lastName = res.data.lastName;
					$rootScope.currentUser.photoUrl = res.data.photoUrl;
				})
				.catch(function (err) {
					console.log(err);
				});


		}

		function getUserDetails(username) {
			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}
			return $http({
				url: twwmConfig.authEndpoint + '/api/user/' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + token
				}
			});
		}

		function getLatLng() {
			var latLng = [];

			var token = localStorageService.get('access_token');

			if (token == null) {
				$state.go('login');
				return;
			}

			function error(err) {
				console.log(err);
				ResponseService.error(err);
			}


			if (localStorageService.get('user_lat') == null) {

				var getObj = {
					method: 'GET',
					url: twwmConfig.authEndpoint + '/api/user',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}

					$http(getObj)
					.then(function (res) {

						$rootScope.currentUser.lat = res.data.latitude;
						$rootScope.currentUser.lng = res.data.longitude;

						latLng.push(res.data.latitude);
						latLng.push(res.data.longitude);
						setLatLng(latLng[0], latLng[1]);
						return latLng;
					})
					.catch(error);

			} else {
				$rootScope.currentUser.lat = localStorageService.get('user_lat');
				$rootScope.currentUser.lng = localStorageService.get('user_lng');

				latLng.push(Number(localStorageService.get('user_lat')));
				latLng.push(Number(localStorageService.get('user_lng')));
				return latLng;
			}

			if(latLng.length === 0){
				return [0, 0];
			}
			
		}

		function setLatLng(lat, lng) {
			if (lat) {
				localStorageService.set('user_lat', lat);
			}
			if (lng) {
				localStorageService.set('user_lng', lng);
			}
		}
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('LoginController', LoginController);

	LoginController.$inject = ['$rootScope', '$state', 'AuthService', 'UserService', 'ResponseService', 'localStorageService'];
	function LoginController($rootScope, $state, AuthService, UserService, ResponseService, localStorageService) {
		var vm = this;

		vm = {
			doesNotMatch: false,
			email: '',
			forgotPassword: forgotPassword,
			login: login,
			password: '',
			resetPassword: resetPassword
		}

		$rootScope.hideLoading();

		return vm;

		function error(err) {
			ResponseService.error(err);
		}

		function submit(key, val) {
			return localStorageService.set(key, val);
		}

		function forgotPassword() {

			$rootScope.passwordReset = AuthService.resetPassword;

			function resetPassword(callback) {

				if (typeof callback != 'undefined') {
					callback = success;
				}
				var postObj = {
					url: twwmConfig.authEndpoint + '/api/registration/reset_request?username=' + encodeURIComponent($rootScope.email),
					method: 'GET'
				}

				$http(postObj).then(callback).catch(error);
			}

			$rootScope.passwordMessages = {
				instruction: 'Please enter your email address. A password reset link will be emailed to you.',
				complete:false
			}

			$.magnificPopup.open({
				items: {
					src: '#passwordReset',
					type: 'inline'
				},
				removalDelay: 300,
				mainClass: 'twwm-fade'
			});
		}

		function resetPassword() {
			if (vm.password !== vm.password2) {
				vm.doesNotMatch = true;
				return;
			} else {
				AuthService.setNewPassword(vm.email, vm.password, $state.params.token)
					.then(function(res){
						login();
						vm.doesNotMatch = false;
					})
					.catch(function(err){
						ResponseService.error(err);
						vm.doesNotMatch = false;
					});
			}
			
		}

		function login() {

			localStorageService.set('username', vm.email);

			AuthService.login(vm.email, vm.password, 'participate.index')
				.then(function (res) {
					AuthService.storeToken(res.data.access_token, res.data.refresh_token);
					return res;
				})
				.then(UserService.storeUser)
				.catch(AuthService.loginError);
		}
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('ActivitiesController', ActivitiesController);

	ActivitiesController.$inject = ['$http', '$rootScope', 'twwmConfig', 'UserService', 'ResponseService', 'AuthService'];

	function ActivitiesController($http, $rootScope, twwmConfig, UserService, ResponseService, AuthService) {
		var vm = this;

		vm = {
			completedActivities: [],
			joinedActivities: [],
			myActivities: myActivities
		}


		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (newValue, oldValue) {
			if (!_.isUndefined(newValue)) {
				vm.myActivities(newValue);
			}
		});

		return vm;

		

		function myActivities(username) {
			getActivities(username)
				.then(function (res) {
					vm.joinedActivities = _.orderBy(res.data.joinedActivityList, 'start', 'desc');
					vm.completedActivities = _.orderBy(res.data.completedActivityList, 'start', 'desc');
					

					AuthService.refreshToken()
						.then(function (res) {
							$rootScope.hideLoading();
							AuthService.storeToken(res.data.access_token, res.data.refresh_token, false);
						})
						.catch(function (err) {
							console.log(err);
						});
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function getActivities(username) {
			var endDate = moment().format('YYYY-MM-DD');
			return $http({
				url: twwmConfig.contentEndpoint + '/dashboard/2017-01-01/' + endDate + '?username=' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}
	}

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', '$rootScope', 'UserService', 'AuthService', 'MediaService', 'ResponseService', 'GDoSService'];

    function ProfileController($state, $rootScope, UserService, AuthService, MediaService, ResponseService, GDoSService) {
    	var vm = this;

    	vm = {
    		filename: '',
    		getTerritories: getTerritories,
    		getLatLongOfUser: getLatLongOfUser,
			logout: logout,
    		setPreference: setPreference,
			territories:[],
    		updateUser: updateUser,
    		uploadPhoto: uploadPhoto
    	}

    	if (AuthService.hastoken()) {
    		UserService.getUser().then(function (res) {
    			var user = res.data;
    			vm.getLatLongOfUser(user);

    			if (user.firstName === "First Name")
    				user.firstName = '';
    			if (user.lastName === "Last Name")
    				user.lastName = '';

    			vm.user = user;
    		}).catch(error);
    	} else {
    		$state.go('login');
    	}

    	$rootScope.hideLoading();

    	vm.getTerritories();

    	return vm;

    	function getLatLongOfUser(user) {
    		if (!user || !user.locationSharing) {
    			return;
    		} else if (user.locationSharing && "geolocation" in navigator) {
    			return navigator.geolocation.getCurrentPosition(function (success) {
    				user.latitude = success.coords.latitude;
    				user.longitude = success.coords.longitude;
    			}, function (error) {
    				console.log(error);
    			});
    		}
    	}

        function getTerritories() {
        	GDoSService.getTerritories()
				.then(function (res) {
					if (res.data.data) {
						vm.territories = res.data.data;
					} else {
						vm.territories = res.data;
					}
					
				})
				.catch(function (res) {
					console.log(res);
				});
        }

        function setPreference(pref) {
        	if (vm.user[pref]) {
        		vm.user[pref] = false;
        	} else {
        		vm.user[pref] = true;
        	}
        }

        function logout() {
        	AuthService.logout();
        	console.clear();
        }

        function error(err) {
        	ResponseService.error(err);
        }

        function success(response) {
        	console.log(response);
        	$rootScope.hideLoading();
        }

        function uploadPhoto(file) {

        	if (!file) {
        		return;
        	}

        	var tags = "twwm-profilePhoto";
        	var options = {
        		width:200,
        		height:200,
        		quality:.8,
        		type: 'image/jpeg',
        		centerCrop: true
        	}

        	MediaService
				.resize(file, options)
				.then(MediaService.convert)
				.then(function (res) {
					$rootScope.addLoading();
					return MediaService.createObj(res, file.name, tags)
				})
				.then(MediaService.uploadMedia)
				.then(function (res) {
					if(res.data.uploaderUsername === vm.user.username)
						vm.user.photoUrl = res.data.fullUrl;
					updateUser();

					$rootScope.hideLoading();
        		}).catch(function(err){
        			ResponseService.error(err, 'There was a problem uploading your photo. Please make sure it is less than 1000x1000 pixels and a JPG Image');
        			$rootScope.hideLoading();
        		});
        }

        function updateUser() {

        	function success(res) {
        		$rootScope.hideLoading();

        		$rootScope.response = {
        			title: 'Success',
        			body: 'Your profile has been updated!'
        		}

        		$.magnificPopup.open({
        			items: {
        				src: '#msgDialog',
        				type: 'inline'
        			},
        			callbacks: {
        				close: function () {
        					delete $rootScope.response.title;
        					delete $rootScope.response.body;
        				}
        			}
        		});
        	}

        	$rootScope.addLoading();

        	delete vm.user.password;

        	console.log(vm.user);

        	UserService.updateUser(vm.user)
                .then(success)
				.catch(error);
        }

    }

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$state', '$rootScope', '$timeout', 'UserService', 'AuthService', 'ResponseService', 'GDoSService'];

	function RegisterController($state, $rootScope, $timeout, UserService, AuthService, ResponseService, GDoSService) {
		var vm = this;

		vm = {
			getTerritories: getTerritories,
			getLatLong: getLatLong,
			locationIsShared: true,
			postalCode: '',
			registerUser: registerUser,
			territories: [],
			user: {}
		}

		$rootScope.hideLoading();

		vm.getTerritories();
		vm.getLatLong();

		return vm;

		function getTerritories() {
			GDoSService.getTerritories()
				.then(function (res) {
					if (res.data.data) {
						vm.territories = res.data.data;
					} else {
						vm.territories = res.data;
					}

				})
				.catch(function (res) {
					console.log(res);
				});
		}

		function error(err) {
			ResponseService.error(err);
		}

		function success(response) {
			console.log(response);
			$rootScope.hideLoading();
		}

		function getLatLong() {
			if ("geolocation" in navigator) {
				return navigator.geolocation.getCurrentPosition(function (success) {

					vm.user.latitude = success.coords.latitude;
					vm.user.longitude = success.coords.longitude;
 
				}, function (error) {
					vm.locationIsShared = false;
				});
			} else {
				vm.locationIsShared = false;
			}
		}

		function loginNewlyRegisteredUser(res, user) {
			console.log(res);
			var attempts = 0;

			function tryLogin(res) {
				if (attempts === 3 && UserService.getToken('access_token') == null) {
					AuthService.loginError(res);
				} else {
					AuthService.login(user.username, user.password)
					.then(function (res) {
						AuthService.storeToken(res.data.access_token, res.data.refresh_token);
						UserService.storeUser();
					})
					.catch(function (err) {
						attempts++;
						tryLogin(err);
					});
				}
				
			}

			$timeout(tryLogin, 1000);

		}

		function registerUser() {

			var username = vm.user.username;
			var password = vm.user.password;

			$rootScope.addLoading();
 
			UserService.registerUser(vm.user)
				//.then(checkPreExistingUser)
				.then(function(res){
					loginNewlyRegisteredUser(res, vm.user)
				})
				.catch(error);
		}
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('AdminController', AdminController);

	AdminController.$inject = ['$rootScope', '$http', 'UserService', 'ResponseService'];
	function AdminController($rootScope, $http, UserService, ResponseService) {
		var vm = this;

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('LogsController', LogsController);

	LogsController.$inject = ['$rootScope', '$scope', '$state', '$http', 'twwmConfig', 'UserService', 'ResponseService'];
	function LogsController($rootScope, $scope, $state, $http, twwmConfig, UserService, ResponseService) {
		var vm = this;

		vm = {
			getErrors: getErrors,
			errorRequest: {
				"StartDateUtc": "01/01/2017",
				"EndDateUtc": moment().format('MM/DD/YYYY').toString(),
				"PageSize": 10,
				"PageNum": 0,
				"SortDirection": "DESC",
				"SortColumn": "EventTime",
				"WorkstationNameFilter": "",
				"ApplicationVersionFilter": "",
				"ApplicationFilter": "",
				"ModuleFilter": "",
				"MethodFilter": "",
				"UsernameFilter": "",
				"HttpStatusFilter": "",
				"HttpErrorFilter": ""
			},
			errors: [],
			nextErrors: next,
			pageNum:0,
			prevErrors: prev,
			sortType: 'EventTime',
			sortReverse: true
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		vm.getErrors();

		$scope.count = 1;

		return vm;

		

		function prev() {
			if (vm.errorRequest.PageNum === 0) {
				getErrors(0);
			} else {
				$scope.count = vm.errorRequest.PageNum;
				var num = $scope.count - 1;
				getErrors(num);
			}
		}

		function next() {
			var num = $scope.count++;

			getErrors(num);
		}

		function getErrors(page) {
			
			$rootScope.addLoading();
			if (_.isUndefined(page)) {
				page = 0;
			}

			vm.errorRequest.PageNum = page;

			$.ajax({
				"async": true,
				"crossDomain": true,
				"url": twwmConfig.logreportEndpoint,
				"method": "POST",
				"headers": {
					"content-type": "application/json"
				},
				"processData": false,
				"data": JSON.stringify(vm.errorRequest)
			})
			.done(function (res) {
				
				vm.errors = res.RetVal.filter(function (item) {
					return item.Username !== 'uf.ajdeaton@gmail.com';
				});

				$rootScope.hideLoading();
			})
			.fail(function (err) {
				$rootScope.hideLoading();
			});


		}


	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('ProvidedContentAdminController', ProvidedContentAdminController);

	ProvidedContentAdminController.$inject = ['$rootScope', '$state', '$http', 'twwmConfig', 'UserService', 'ResponseService'];
	function ProvidedContentAdminController($rootScope, $state, $http, twwmConfig, UserService, ResponseService) {

		var vm = this;

		vm = {
			create: createItem,
			currentState: $state.current.name.split('.')[1],
			editItem: editItem,
			deleteItem: deleteItem,
			get: getItems,
			isEditing:false,
			item: {
				"actionCount": 0,
				"actioned": false,
				"author": $rootScope.currentUser.username || 'TWWMContentTeam',
				"body": "",
				"campaign": {
					"id": twwmConfig.campaignId,
					"name": twwmConfig.campaignName
				},
				"flagged": false,
				"id": "",
				"publishDate": "",
				"title": ""
			},
			items: [],
			reset:reset
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (newValue, oldValue) {
			if (!_.isUndefined(newValue)) {
				vm.item.author = newValue;
			}
		});

		vm.get();

		$rootScope.hideLoading();

		return vm;

		function editItem(item) {
			if (!item) {
				console.log('no item');
			}
			vm.isEditing = true;
			vm.item = item.item;
		}

		function getItems() {
			$rootScope.addLoading();
			$http({
				method: 'GET',
				url: twwmConfig.contentEndpoint + '/' + vm.currentState + '/all/0/1000',
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				vm.items = $rootScope.orderByDate(res.data.content, 'providedContent');
				angular.forEach(vm.items, function (v) {
					v.publishDate = new Date(v.publishDate);
				});
			})
			.catch(function (err) {
				console.log(err);
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function createItem() {
			$rootScope.addLoading();
			$http({
				method: 'POST',
				data: vm.item,
				url: twwmConfig.contentEndpoint + '/' + vm.currentState,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				vm.get();
				reset();
			})
			.catch(function (err) {
				console.log(err);
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function deleteItem(id) {
			$rootScope.addLoading();
			$http({
				method: 'DELETE',
				url: twwmConfig.contentEndpoint + '/' + vm.currentState + '/' + id,
				headers: {
					'Authorization': 'Bearer ' + UserService.getToken()
				}
			})
			.then(function (res) {
				getItems();
				reset();
			})
			.catch(function (err) {
				ResponseService.error(err, 'There was a problem deleting this post. Please try again later.');
			})
			.finally(function () {
				$rootScope.hideLoading();
			});
		}

		function reset() {
			document.getElementById("contentCreator").reset();
			vm.item.id = "";
			vm.isEditing = false;
		}


	}

})();
(function () {
	'use strict';

	var BlogCtrl = function ($scope, $state, BlogService, SearchService) {
		var vm = this;

		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;
		vm.resetSearch = resetSearch;
		vm.submitSearch = submitSearch;
		vm.totalCount = 0;
		vm.limit = 1;
		vm.increaseLimit = function () {
			if (vm.limit < vm.totalCount) {
				vm.limit += 1;
			}
		};

		//vm.currentPage = '0';
		//vm.pageSize = '5';
		
		//vm.totalPages = 0;
		//vm.getNumber = function (num) {
		//	return new Array(num);
		//};

		function resetSearch() {
			vm.hasTerm = false;
			delete vm.result;

			if ($state.current.name == 'blog.post')
				vm.getDetail();
			else
				vm.getIndex();
		}

		function submitSearch(term, scope) {
			SearchService.submitSearch(term, scope)
				.then(function (response) {
					vm.index = response.data.objects;
					vm.hasTerm = true;
					vm.result = SearchService.getResultsLabel(response, term);
				})
		}

		function getIndex() {
			//if (_.isUndefined(qty)) {
			//	qty = vm.pageSize;
			//}

			//if (_.isUndefined(page)) {
			//	page = vm.currentPage;
			//} else if (typeof page === "number") {
			//	page = page.toString();
			//	vm.currentPage = page;
			//}

			BlogService('blog')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = collection;
					vm.index = collection;
				})
				.then($scope.hideLoading)
				.catch(function (err) {
					console.log(err);
				});
		};

		function getDetail() {
			BlogService('blog')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = collection;
					return collection.filter(function (post) {
						return post.urlAlias === vm.postUrl;
					});
				})
				.then(function (collection) {
					vm.index = collection;
				})
				.then($scope.hideLoading);
		};

		function readSuccess(response) {

			vm.totalCount = response.data.totalCount;

			$.each(response.data.news, function (i, v) {
				var postPublishDate = moment(v.publishDate, moment.ISO_8601);
				if (moment(new Date(), moment.ISO_8601).isBefore(postPublishDate)) {
					response.data.news[i].published = false;
				}
			});

			return response.data.news;

		}

		$scope.$on('$stateChangeSuccess', function () {
			vm.postUrl = $state.params.postUrl;
			$scope.$wrapperClass = 'wrapper';

			if (vm.postUrl)
				getDetail();
			else
				getIndex();
		});

	};

	BlogCtrl.$inject = ['$scope', '$state', 'BlogService', 'SearchService'];

	angular
        .module('app')
        .controller('BlogController', BlogCtrl);

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', '$http', 'UserService', 'MediaService', 'twwmConfig', 'ResponseService'];
	function DashboardController($rootScope, $http, UserService, MediaService, twwmConfig, ResponseService) {
		var vm = this;
		
		$rootScope.addLoading();

		vm = {
			dashboardDetails:{},
			getDashboard: getDashboard,
			showActivities: false,
			uploadPhoto: uploadPhoto
		}

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
			if (!_.isUndefined(newValue) || !_.isUndefined(oldValue)) {
				var username = $rootScope.currentUser.username;

				vm.getDashboard(username)
				.then(function (res) {
					vm.dashboardDetails = res.data;

					angular.forEach(vm.dashboardDetails.topUsersByActivity, function (user, i) {

						UserService.getUserDetails(user.username)
							.then(function (res) {

								if (res.data.firstName != "First Name") {
									vm.dashboardDetails.topUsersByActivity[i].username = res.data.firstName + ' ' + _.truncate(res.data.lastName, {
										'length': 2,
										'omission': '.'
									});
								} else {
									vm.dashboardDetails.topUsersByActivity[i].username = "Anonymous";
								}
								vm.dashboardDetails.topUsersByActivity[i].photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								ResponseService.error(err);
							});
					});

					angular.forEach(vm.dashboardDetails.topUsersByPeopleReached, function (user, i) {

						UserService.getUserDetails(user.username)
							.then(function (res) {

								if (res.data.firstName != "First Name") {
									vm.dashboardDetails.topUsersByPeopleReached[i].username = res.data.firstName + ' ' + _.truncate(res.data.lastName, {
										'length': 2,
										'omission': '.'
									});
								} else {
									vm.dashboardDetails.topUsersByPeopleReached[i].username = "Anonymous";
								}
								vm.dashboardDetails.topUsersByPeopleReached[i].photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								ResponseService.error(err);
							});
					});
				})
				.catch(function (err) {
					ResponseService.error(err);
				})
				.finally(function (res) {
					$rootScope.hideLoading();
				});
			}
		});
		
		

		return vm;

		function getDashboard(username) {
			var endDate = moment().format('YYYY-MM-DD');

			return $http({
				url: twwmConfig.contentEndpoint + '/dashboard/2017-01-01/' + endDate + '?username=' + username,
				method: 'GET',
				headers: {
					'authorization': 'Bearer ' + UserService.getToken()
				}
			});
		}

		function uploadPhoto(file) {
			MediaService.updatePhoto(file);
		}


	}

})();
(function () {
	'use strict';

	var EventsCtrl = function ($scope, $state, BlogService, SearchService, Page) {
		var vm = this;

		vm.featuredEvent = {};
		vm.getDetail = getDetail;
		vm.getIndex = getIndex;
		vm.index = [];
		vm.postUrl;
		vm.resetSearch = resetSearch;
		vm.submitSearch = submitSearch;

		Page('eventPageHeader')
			.then(function (response) {
				vm.featuredEvent.image = response.data.thumbFacebookMetaTag;
				vm.featuredEvent.imageurl = response.data.redirectUrl;
			})
			.catch(function (err) {
				console.log(err);
			});

		function resetSearch() {
			vm.hasTerm = false;
			delete vm.result;

			if ($state.current.name == 'events.event')
				vm.getDetail();
			else
				vm.getIndex();
		}

		function submitSearch(term, scope) {
			SearchService.submitSearch(term, scope)
				.then(function (response) {
					vm.index = response.data.objects;
					vm.hasTerm = true;
					vm.result = SearchService.getResultsLabel(response, term);
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function getIndex() {
			BlogService('events')
				.then(readSuccess)
				.then(function (posts) {
					vm.index = _.orderBy(posts, 'publishDate', 'asc');
					$scope.featured = vm.index;
				})
				.then($scope.hideLoading)
				.catch(function (err) {
					console.log(err);
				});
		}

		function getDetail() {
			BlogService('events')
				.then(readSuccess)
				.then(function (collection) {
					$scope.featured = _.orderBy(collection, 'publishDate', 'asc');
					return collection.filter(function (post) {
						return post.urlAlias === vm.postUrl;
					});
				})
				.then(function (collection) {
					vm.index = collection;
				})
				.then($scope.hideLoading)
				.catch(function (err) {
					console.log(err);
				});
		}

		$scope.getDay = function () {
			return moment(new Date).format("dddd");
		};

		$scope.getDate = function () {
			return moment(new Date).format("D MMM YYYY");
		};

		$scope.$on('$stateChangeSuccess', function () {
			vm.postUrl = $state.params.postUrl;
			$scope.$wrapperClass = 'wrapper';

			if (vm.postUrl)
				getDetail();
			else
				getIndex();
		});

	};

	function readSuccess(response) {

		$.each(response.data.news, function (i, event) {
			var addr = $.parseHTML(event.synopsis);
			if (addr == null) return;
			response.data.news[i].address = '//www.google.com/maps/dir/Current+Location/' + addr[2].innerText + '/data=!4m2!4m1!3e0';
		});

		return response.data.news;

	}

	EventsCtrl.$inject = ['$scope', '$state', 'BlogService', 'SearchService', 'Page'];

	angular
        .module('app')
        .controller('EventsController', EventsCtrl);

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('NavController', NavController);

	NavController.$inject = ['$rootScope', '$location'];
	function NavController($rootScope, $location) {
		var vm = this;
		return;
	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('PageController', PageController);

	PageController.$inject = ['$rootScope', '$http', '$state', 'twwmConfig'];
	function PageController($rootScope, $http, $state, twwmConfig) {
		var vm = this;

		if ($state.params.pageName == null || $state.params.pageName == 'undefined') {
			$state.go('home');
			return;
		}
		
		$http({
			method: "GET",
			url: twwmConfig.publicEndpoint + '/' + $state.params.pageName + '/json'
		}).then(function (response) {
			vm.page = response.data;
			angular.element('body').removeClass('loading');
		});

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('TimeCtrl', TimeCtrl);

	TimeCtrl.$inject = ['$rootScope','$interval'];
	function TimeCtrl($rootScope, $interval) {
		var tick = function () {
			$rootScope.clock = moment(new Date).format("LTS");
		}
		tick();
		$interval(tick, 1000);

		return;
	}

})();
(function () {
	'use strict';

	angular
        .module('home', ['slickCarousel', 'homePanelOne', 'homePanelTwo', 'homePanelThree', 'homePanelFour'])
        .controller('HomeController', HomeController);

	HomeController.$inject = ['$rootScope', '$http', '$q', 'Page', '$anchorScroll', '$location'];
	function HomeController($rootScope, $http, $q, Page, $anchorScroll, $location) {
		var vm = this;

		vm.hideHeader = true;

		vm.title = 'The Whole World Mobilising';

		vm.gotoAnchor = function (x) {
			var newHash = 'anchor' + x;
			if ($location.hash() !== newHash) {
				// set the $location.hash to `newHash` and
				// $anchorScroll will automatically scroll to it
				$location.hash('anchor' + x);
				var header = angular.element('header');
				header.addClass('fixed');
			}
		};


		vm.getHome = function () {
			return $q.all([
				Page('home'),
				Page('homePanelTwo'),
				Page('homePanelThree'),
				Page('homePanelFour')
			]).then(function (responses) {
					$rootScope.panelOne = responses[0].data;
					$rootScope.panelTwo = responses[1].data;
					$rootScope.panelThree = responses[2].data;
					$rootScope.panelFour = responses[3].data;
					$rootScope.slidesLoaded = true;
					angular.element('body').removeClass('loading');
					return $rootScope;
			});
		};

		vm.getHome();
		

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('CreateActivityController', CreateActivityController);

	CreateActivityController.$inject = ['$rootScope', '$state', 'EvangelismService', 'ActivityService', 'UserService', 'ResponseService', 'MapService'];
	function CreateActivityController($rootScope, $state, EvangelismService, ActivityService, UserService, ResponseService, MapService) {

		var vm = this;
		var newActivityButtons = Array.from(document.querySelectorAll('.newActivity__option'));

		vm = {
			activity: {
				activityType: {

				},
				startLocation: {
					lat: 0,
					lon:0
				},
				username: ''
			},
			address: {

			},
			addedActivity: {},
			multipleDay: false,
			start: {
				date: '',
				time:''
			},
			isEvangelism:false,
			step: 1,
			clearActivityDetails: clearActivityDetails,
			createActivity: createActivity,
			moveBack: moveBack,
			setActivityType: setActivityType,
			validateActivityStep: validateActivityStep,
			validationErrorMsg: ''
		}

		$rootScope.hideLoading();

		return vm;

		function getUsername() {
			if (_.isEmpty($rootScope.currentUser)) {
				UserService.getUser()
					.then(UserService.storeUser)
					.catch(ResponseService.error);
			} else {
				vm.activity.username = $rootScope.currentUser.username;
			}

			$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
				vm.activity.username = $rootScope.currentUser.username;
			});
		}

		function createActivity() {

			if (vm.start.date && vm.start.time) {
				createActivityTimeStamp();
			} else {
				vm.validationErrorMsg = 'Please double check that you have added your time and date correctly.';
				return;
			}

			if (vm.activity.username == 'undefined') {
				getUsername();
			}
			
			$rootScope.addLoading();

			if (vm.activity.activityType.name === "Evangelism") {
				EvangelismService.create(vm.activity)
				.then(function (res) {
					var activityId = res.data.id;

					if (!vm.activity.privateActivity) {
						MapService.createPin(res.data.title, res.data.id, res.data.identity.contentClass, res.data.startLocation.lat, res.data.startLocation.lon)
							.then(function (res) {
								ResponseService.success('Your Evangelism Event was Saved!');
								vm.step = 4;
								MapService.createMap();
								$state.go('participate.evangelism', { evangelismId: activityId });
							})
							.catch(function (err) {
								console.log(err);
								ResponseService.error(err);
								$state.reload();
							});
					} else {
						ResponseService.success('Your Evangelism Event was Saved!');
						vm.step = 4;
						$state.go('participate.evangelism', { evangelismId: activityId });
					}

				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$state.reload();
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
			} else {
				ActivityService.create(vm.activity)
				.then(function (res) {
					var activityId = res.data.id;

					if (!vm.activity.privateActivity) {
						MapService.createPin(res.data.title, res.data.id, res.data.identity.contentClass, res.data.startLocation.lat, res.data.startLocation.lon)
						.then(function (res) {
							ResponseService.success('Your Activity was Saved!');
							vm.step = 4;
							MapService.createMap();
							$state.go('participate.activity', { activityId: activityId });
						})
						.catch(function (err) {
							console.log(err);
							ResponseService.error(err);
							$state.reload();
						});
					} else {
						ResponseService.success('Your Activity was Saved!');
						vm.step = 4;
						$state.go('participate.activity', { activityId: activityId });
					}

				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$state.reload();
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
			}

		}

		function clearActivityDetails() {
			$state.go('participate.mobilise');
		}

		function moveBack() {
			if(vm.step !== 1)
				vm.step--;
		}

		function validateActivityStep() {
			
			if (vm.step === 1) {

				getUsername();

				if (vm.activity.activityType.id) {
					vm.validationErrorMsg == '';
					vm.step++;
					return;
				} else {
					vm.validationErrorMsg = 'Please click on an activity above to proceed.';
					return;
				}
			}

			if (vm.step === 2) {
				vm.validationErrorMsg == '';
				if (vm.address.city && vm.address.state && vm.activity.title) {
					vm.validationErrorMsg == '';
					$rootScope.addLoading();
					getLatLong()
						.then(setLatLong)
						.catch(function (err) {
							ResponseService.error(err);
							console.log(err);
						})
						.finally(function () {
							$rootScope.hideLoading();
						});

					vm.step++;
					return;
				} else {
					vm.validationErrorMsg = 'Please ensure that you have filled out the required fields.';
					$.each($('input[required]'), function (i, item) {
						if ($(item).val() === "") {
							$(item).addClass('invalid');
						} else {
							$(item).removeClass('invalid');
						}
					});
					return;
				}
			}

			if (vm.step === 3) {

				if (vm.activity.activityType.id && vm.start.date !== '') {
					createActivity();
				} else {
					vm.validationErrorMsg = 'Please double check that you have added your time and date correctly.';
					return;
				}
				
			}
	
		}

		function getLatLong(add) {
			var add = vm.address.line1 + ' ' + vm.address.city + ' ' + vm.address.state + ' ' + vm.address.postalCode;
			return ActivityService.getLatLong(add);
		}

		function setLatLong(res) {

			vm.activity.startLocation.lat = 0;
			vm.activity.startLocation.lon = 0;

			if (res && res.data && res.data.results.length > 0 && res.data.results[0].geometry.location.lat && res.data.results[0].geometry.location.lng) {
				vm.activity.startLocation.lat = res.data.results[0].geometry.location.lat;
				vm.activity.startLocation.lon = res.data.results[0].geometry.location.lng;
				vm.validationErrorMsg == '';
			} else {
				ResponseService.error('Unfortunately we could not verify that address. Please try again');
				return;
			}
			
			return vm.activity;
		}

		function setMultiDay() {
			if (vm.multipleDay) {
				vm.activity.completed = vm.activity.started;
			}
		}

		function createActivityTimeStamp() {

			var dateParts = vm.start.date.toString().split(' 00:00:00');
			var timeParts = vm.start.time.toString().split('1970 ');

			if (dateParts && timeParts) {
				var newDate = new Date(dateParts[0] + ' ' + timeParts[1]);
				vm.activity.start = newDate.toUTCString();
			}
		}

		function setActivityType(event) {

			vm.validationErrorMsg = '';

			for (var i = 0; i < newActivityButtons.length; i++) {
				newActivityButtons[i].classList.remove('selected');
			}
			event.currentTarget.classList.add('selected');
			vm.activity.activityType.id = event.currentTarget.dataset.id;
			vm.activity.activityType.name = event.currentTarget.innerText;

			if (vm.activity.activityType.id === "15") {
				setupEvangelismType();
			} else {
				clearEvangelismType();
			}
		}

		function clearEvangelismType() {
			delete vm.activity.attendance;
			delete vm.activity.seekers;
			vm.isEvangelism = false;
		}


		function setupEvangelismType() {
			vm.isEvangelism = true;
			vm.activity.attendance = 0;
			vm.activity.seekers = 0;
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('ParticipateController', ParticipateController);

	ParticipateController.$inject = ['$scope', '$rootScope', '$http', '$state', 'UserService', 'MediaService', 'AuthService', 'MapService', 'twwmConfig', 'localStorageService'];
	function ParticipateController($scope, $rootScope, $http, $state, UserService, MediaService, AuthService, MapService, twwmConfig, localStorageService) {
		var vm = this;

		vm = {
			clickHandler: clickHandler,
			getLatLongOfUser: getLatLongOfUser,
			getSingleActivity: getSingleActivity,
			googleMapsUrl: MapService.googleMapsUrl,
			pins: $rootScope.pins,
			pinMouseover: pinMouseOver,
			pinMouseout: pinMouseOut,
			setActiveState:setActiveState,
			dynMarkers: [],
			userLat: 0,
			userLong: 0,
			username: $rootScope.currentUser.username
		}

		//if (!AuthService.hastoken()) {
			//$state.go('login');
			//return;
		//}

		$scope.$on('$stateChangeStart', function () {
			closeFlyout();
		});

		$scope.$on('$stateChangeSuccess', function () {
			openFlyout();
			$rootScope.hideLoading();
		});

		if (vm.userLat === 0 || vm.userLong === 0) {
			vm.getLatLongOfUser();
		}

		MapService.createMap();

		return vm;

		function setActiveState(activity, id) {

			if ($state.current.name === 'participate.pray' && activity === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'mobilise') && activity === 'org.salvationarmy.mobilize.content.domain.activity.Mobilize') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'read') && activity === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (_.includes($state.current.name, 'reach') && activity === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$('.custom-marker').removeClass('enlarged');
				return true;
			} else if (!_.isUndefined($state.params.prayerId) && $state.params.prayerId === id) {
				return true;
			} else if (!_.isUndefined($state.params.activityId) && $state.params.activityId === id) {
				return true;
			} else if (!_.isUndefined($state.params.evangelismId) && $state.params.evangelismId === id) {
				return true;
			} else {
				return false;
			}
		}

		function getSingleActivity(id, type) {
			
			if (type === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$state.go('participate.prayer', { prayerId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.activity.Evangelism') {
				$state.go('participate.evangelism', { evangelismId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$state.go('participate.readItem', { urlAlias: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$state.go('participate.reachItem', { urlAlias: id });
			} else {
				$state.go('participate.activity', { activityId: id });
			}
		}

		function pinMouseOver() {
			angular.element(this)[0].classList.add('hovered');
			angular.element(this)[0].style.cursor = 'pointer';
		}

		function pinMouseOut() {
			angular.element(this)[0].classList.remove('hovered');
			angular.element(this)[0].style.cursor = '';
		}

		function clickHandler(event, id, type) {
			
			$('.custom-marker').removeClass('enlarged');
			angular.element(this).addClass('enlarged');

			if (type === 'org.salvationarmy.mobilize.content.domain.Prayer') {
				$state.go('participate.prayer', { prayerId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.activity.Evangelism') {
				$state.go('participate.evangelism', { evangelismId: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Reading') {
				$state.go('participate.readItem', { urlAlias: id });
			} else if (type === 'org.salvationarmy.mobilize.content.domain.Outreach') {
				$state.go('participate.reachItem', { urlAlias: id });
			} else {
				$state.go('participate.activity', { activityId: id });
			}
			
		}

		function openFlyout() {
			var flyout = document.querySelector('.flyout');
			flyout.classList.remove('isClosed');				
		}

		function closeFlyout() {
			var flyout = document.querySelector('.flyout');
			flyout.classList.add('isClosed');
		}

		function getLatLongOfUser() {

			if (!$rootScope.currentUser.locationPermission) {
				return false
			} else if ($rootScope.currentUser.locationPermission && "geolocation" in navigator) {
				return navigator.geolocation.getCurrentPosition(function (success) {
					$rootScope.currentUser.lat = vm.userLat = success.coords.latitude;
					$rootScope.currentUser.lng = vm.userLong = success.coords.longitude;
					UserService.setLatLng(vm.userLat, vm.userLong);
					console.log(vm.userLat, vm.userLong);
				}, function (error) {
					$rootScope.currentUser.lat = vm.userLat = UserService.getLatLng()[0] || 0;
					$rootScope.currentUser.lng = vm.userLong = UserService.getLatLng()[1] || 0;

					console.log(vm.userLat, vm.userLong, error, 'error');
				});
			}
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('ReadReachController', ReadReachController);

	ReadReachController.$inject = ['$rootScope', '$state', '$location', 'ProvidedContentService', 'UserService', 'ResponseService', 'MapService', 'CommentService'];
	function ReadReachController($rootScope, $state, $location, ProvidedContentService, UserService, ResponseService, MapService, CommentService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			commentTools: {
				id: false
			},
			content: {},
			flagItem: flagItem,
			fullUrl:$location.absUrl(),
			getItem: getItem,
			remove: remove,
			removeComment: removeComment,
			reportComment: reportComment,
			response: '',
			submitResponse: submitResponse,
			toggleParticipation: toggleParticipation,
			type: $state.current.name === "participate.readItem" ? 'read' : 'reach'
		}

		vm.getItem();

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

		function addResponse() {
			vm.isResponding = true;
		}

		function submitResponse(id) {
			$rootScope.addLoading();
			var type = vm.type === 'reach' ? 'Outreach' : 'Reading';

			CommentService.create(id, $rootScope.currentUser.username, $.trim(vm.response), type)
				.then(function (res) {
					$rootScope.hideLoading();
					vm.isResponding = false;
					getItem();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId) {
			$rootScope.addLoading();
			CommentService.remove(commentId)
				.then(function (res) {
					getItem();
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId) {
			$rootScope.addLoading();
			CommentService.flag(commentId)
				.then(function (res) {
					getItem();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function readSuccess(response) {

			$.each(response.data.content, function (i, v) {
				var postPublishDate = moment(v.publishDate, moment.ISO_8601);
				if (moment(new Date(), moment.ISO_8601).isBefore(postPublishDate)) {
					response.data.content[i].published = false;
				}
			});

			return response.data.content;

		}

		function getItem() {
			var urlAlias = $state.params.urlAlias;
			ProvidedContentService.getSingle(vm.type, urlAlias)
				.then(function (response) {
					vm.content = response.data;
					if (vm.content.comments.length > 0) {
						angular.forEach(vm.content.comments, function (comment) {
							UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
						});
					}
				})
				.catch(function(err){
					console.log(err);
					ResponseService.error(err);
				})
				.finally($rootScope.hideLoading);
		}

		function flagItem(id) {
			$rootScope.addLoading();
			ProvidedContentService.flag(vm.type, id)
				.then(function (res) {
					console.log(res);
					getItem();
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function toggleParticipation(id, bool) {
			if (bool && bool == true) {
				leaveActivity(id);
			} else {
				joinActivity(id);
			}
		}

		function joinActivity(id) {
			$rootScope.addLoading();
			ProvidedContentService.join(vm.type, id)
				.then(function (res) {
					var lat = UserService.getLatLng()[0];
					var lng = UserService.getLatLng()[1];
					if (res.data.success) {
						MapService.createPin(vm.content.title, vm.content.identity.contentId, vm.content.identity.contentClass, lat, lng)
							.then(function (res) {
								console.log(res);
								getItem();
								MapService.createMap();
							})
							.catch(function (err) {
								console.log(err);
							});
						
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

		function leaveActivity(id) {
			$rootScope.addLoading();
			ProvidedContentService.leave(vm.type, id)
				.then(function (res) {
					if (res.data.success) {
						getItem();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function remove(id) {
			$rootScope.addLoading();

			ProvidedContentService.remove(tag, id)
				.then(function (res) {
					$state.go('participate.' + vm.type);
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('SingleActivityController', SingleActivityController);

	SingleActivityController.$inject = ['$rootScope', '$state', '$location', 'ActivityService', 'UserService', 'ResponseService', 'MapService', 'CommentService'];
	function SingleActivityController($rootScope, $state, $location, ActivityService, UserService, ResponseService, MapService, CommentService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			submitResponse: submitResponse,
			response: '',
			commentTools: {
				id: false
			},
			fullUrl: $location.absUrl(),
			removeComment: removeComment,
			reportComment: reportComment,
			isResponding: false,
			content: {},
			loggedInUsername: $rootScope.currentUser.username,
			getActivity: getActivity,
			removeActivity: removeActivity,
			toggleParticipation: toggleParticipation
		}

		vm.getActivity();

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

		function addResponse() {
			vm.isResponding = true;
		}

		function submitResponse(id) {
			$rootScope.addLoading();
			var type = 'activity.' + vm.content.type;
			CommentService.create(id, $rootScope.currentUser.username, $.trim(vm.response), type)
				.then(function (res) {
					$rootScope.hideLoading();
					vm.isResponding = false;
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.remove(commentId)
				.then(function (res) {
					getActivity();
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.flag(commentId)
				.then(function (res) {
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function getActivity() {
			var activityId = $state.params.activityId;
			$rootScope.addLoading();
			ActivityService.getActivity(activityId)
				.then(function (res) {
					
					vm.content = res.data;
					vm.content.type = 'mobilize';
					if (vm.content.comments.length > 0) {
						angular.forEach(vm.content.comments, function (comment) {
							UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
						});
					}

					$rootScope.hideLoading();

				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function toggleParticipation(id, bool) {
			if (bool && bool == true) {
				leaveActivity(id);
			} else {
				joinActivity(id);
			}
		}

		function joinActivity(id) {
			$rootScope.addLoading();
			ActivityService.join(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

		function leaveActivity(id) {
			$rootScope.addLoading();
			ActivityService.leave(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function removeActivity(id) {
			ActivityService.remove(id)
				.then(function (res) {
					if (res.status === 200) {

						if ($rootScope.response) {
							$rootScope.response.title = 'Success!';
							$rootScope.response.body = 'Your activity has been deleted';
						} else {
							$rootScope.response = {
								title: 'Success!',
								body: 'Your activity has been deleted'
							}
						}


						$.magnificPopup.open({
							items: {
								src: '#msgDialog',
								type: 'inline'
							},
							callbacks: {
								close: function () {
									delete $rootScope.response.title;
									delete $rootScope.response.body;
									MapService.createMap();
									$state.go('participate.mobilise');
								}
							}
						});
					}
				})
				.catch(function (err) {
					ResponseService.error(' You do not have the authority to delete this activity.');
				});
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('SingleEvangelismController', SingleEvangelismController);

	SingleEvangelismController.$inject = ['$rootScope', '$state', '$location', 'EvangelismService', 'UserService', 'ResponseService', 'MapService', 'CommentService'];
	function SingleEvangelismController($rootScope, $state, $location, EvangelismService, UserService, ResponseService, MapService, CommentService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			submitResponse: submitResponse,
			response: '',
			commentTools: {
				id: false
			},
			removeComment: removeComment,
			reportComment: reportComment,
			isResponding: false,
			fullUrl: $location.absUrl(),
			content: {},
			canUserDeleteActivity: canUserDeleteActivity,
			loggedInUsername: $rootScope.currentUser.username,
			getActivity: getActivity,
			removeActivity: removeActivity,
			toggleParticipation: toggleParticipation
		}

		vm.getActivity();
		vm.canUserDeleteActivity();

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

		function addResponse() {
			vm.isResponding = true;
		}

		function submitResponse(id) {
			$rootScope.addLoading();
			var type = 'activity.' + vm.content.type;
			CommentService.create(id, $rootScope.currentUser.username, $.trim(vm.response), type)
				.then(function (res) {
					$rootScope.hideLoading();
					vm.isResponding = false;
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.remove(commentId)
				.then(function (res) {
					getActivity();
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId, activityId) {
			$rootScope.addLoading();
			CommentService.flag(commentId)
				.then(function (res) {
					getActivity();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function canUserDeleteActivity() {
			UserService.getUser().then(function (res) {
				vm.loggedInUsername = res.username;
			});
		}

		function getActivity() {
			var activityId = $state.params.evangelismId;
			$rootScope.addLoading();
			EvangelismService.getActivity(activityId)
				.then(function (res) {
					vm.content = res.data;
					vm.content.type = 'evangelism';

					if (vm.content.comments.length > 0) {
						angular.forEach(vm.content.comments, function (comment) {
							UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
						});
					}

					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function toggleParticipation(id, bool) {
			if (bool && bool == true) {
				leaveActivity(id);
			} else {
				joinActivity(id);
			}
		}

		function joinActivity(id) {
			$rootScope.addLoading();
			EvangelismService.join(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

		function leaveActivity(id) {
			$rootScope.addLoading();
			EvangelismService.leave(id)
				.then(function (res) {
					if (res.data.success) {
						getActivity();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function removeActivity(id) {
			EvangelismService.remove(id)
				.then(function (res) {
					if (res.status === 200) {

						if ($rootScope.response) {
							$rootScope.response.title = 'Success!';
							$rootScope.response.body = 'Your activity has been deleted';
						} else {
							$rootScope.response = {
								title: 'Success!',
								body: 'Your activity has been deleted'
							}
						}


						$.magnificPopup.open({
							items: {
								src: '#msgDialog',
								type: 'inline'
							},
							callbacks: {
								close: function () {
									delete $rootScope.response.title;
									delete $rootScope.response.body;
									MapService.createMap();
									$state.go('participate.mobilise');
								}
							}
						});
					}
				})
				.catch(function (err) {
					ResponseService.error(' You do not have the authority to delete this activity.');
				});
		}

	}

})();
(function () {
	'use strict';

	angular
        .module('app')
        .controller('SinglePrayerController', SinglePrayerController);

	SinglePrayerController.$inject = ['$rootScope', '$state', '$http', '$location', 'twwmConfig', 'PrayerService', 'UserService', 'ResponseService', 'MapService'];
	function SinglePrayerController($rootScope, $state, $http, $location, twwmConfig, PrayerService, UserService, ResponseService, MapService) {

		var vm = this;

		vm = {
			addResponse: addResponse,
			submitResponse: submitResponse,
			response: '',
			commentTools: {
				id:false
			},
			removeComment: removeComment,
			reportComment:reportComment,
			isResponding: false,
			fullUrl: $location.absUrl(),
			content: {},
			getPrayer: getPrayer,
			flagPrayer: flagPrayer,
			loggedInUsername: $rootScope.currentUser.username,
			removePrayer: removePrayer,
			toggleParticipation: toggleParticipation
		}

		vm.getPrayer();

		if (_.isEmpty($rootScope.currentUser)) {
			UserService.getUser()
				.then(UserService.storeUser)
				.catch(ResponseService.error);
		}

		return vm;

		function addResponse() {
			vm.isResponding = true;
		}

		function submitResponse(id) {
			$rootScope.addLoading();
			PrayerService.createComment(id, $rootScope.currentUser.username, $.trim(vm.response))
				.then(function (res) {
					getPrayer();
					$rootScope.hideLoading();
					vm.isResponding = false;
					console.log(res);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function getResponses(id) {
			PrayerService.retrieveComments(id)
				.then(function (res) {
					vm.content.comments = res.data;

					if (vm.content.comments.length > 0) {
						angular.forEach(vm.content.comments, function (comment) {
							UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
						});
					}


				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removeComment(commentId, prayerId) {
			$rootScope.addLoading();
			PrayerService.deleteComment(commentId)
				.then(function (res) {
					PrayerService.getPrayer(prayerId);
					$rootScope.hideLoading();
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}


		function reportComment(commentId, prayerId) {
			$rootScope.addLoading();
			PrayerService.flagComment(commentId)
				.then(function (res) {
					PrayerService.getPrayer(prayerId);
				})
				.catch(function (err) {
					console.log(err);
					ResponseService.error(err);
					$rootScope.hideLoading();
				});
		}

		function removePrayer(id) {
			$rootScope.addLoading();

			PrayerService.remove(id)
				.then(function (res) {
					$state.go('participate.pray');
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}


		function getPrayer() {
			var prayerId = $state.params.prayerId;

			PrayerService.getPrayer(prayerId)
				.then(function (res) {

					vm.content = res.data;

					//getResponses(vm.content.id);

					angular.forEach(vm.content.comments, function (comment) {
						comment.active = true;
						comment.created = comment.posted;

						UserService.getUserDetails(comment.username)
								.then(function (res) {
									comment.user = res.data.firstName + ' ' + res.data.lastName.substr(0, 1) + '.';
								})
								.catch(function (err) {
									ResponseService.error(err);
								});
					});
					
					if (vm.content.anonymous) {

						vm.content.title = 'Anonymous';
						delete vm.content.photoUrl;

					} else {
						UserService.getUserDetails(vm.content.username)
							.then(function (res) {
								vm.content.title = res.data.firstName + ' ' + res.data.lastName.charAt(0) + '.';
								if (res.data.photoUrl !== '/Content/Images/camera-white@2x.png')
									vm.content.photoUrl = res.data.photoUrl;
							})
							.catch(function (err) {
								console.log(err);
							})
					}

				})
				.catch(function (err) {
					console.log(err);
				});

		}


		function flagPrayer(id) {
			$rootScope.addLoading();
			PrayerService.flag(id)
				.then(function(res){
					console.log(res);
					getPrayer();
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

		function toggleParticipation(id, bool) {
			if (bool && bool == true) {
				leaveActivity(id);
			} else {
				joinActivity(id);
			}
		}

		function joinActivity(id) {
			$rootScope.addLoading();
			PrayerService.join(id)
				.then(function (res) {
					if (res.data.success) {
						getPrayer();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				});
		}

		function leaveActivity(id) {
			$rootScope.addLoading();
			PrayerService.leave(id)
				.then(function (res) {
					if (res.data.success) {
						getPrayer();
						MapService.createMap();
					}
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					$rootScope.hideLoading();
				})
		}

	}

})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmActivity', function () {
			return {
				templateUrl: "App/Templates/Account/activity.tpl.html"
			};
		});
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmLogin', function () {
			return {
				templateUrl: "App/Templates/Account/login.tpl.html"
			};
		});
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('dashboardLeaderboard', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Dashboard/leaderboard.tpl.html"
			};
		});
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmAnchor', ['$anchorScroll', '$location', function ($anchorScroll, $location) {
			return {
				restrict: 'C',
				link: function (scope, element, attrs) {

					$(element).on('click', function (e) {
						e.preventDefault();
						$location.hash(attrs.href);
						$anchorScroll();
					});

				}
			}
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('caption', ['$compile', function ($compile) {
			return {
				restrict: 'C',
				link: function (scope, element, attrs) {
					$(element).captionjs({
						'force_dimensions': true
					});
				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('comment', ['$compile', function ($compile) {
			return {
				restrict: 'E',
				templateUrl: "App/Templates/Global/comment.tpl.html",
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('compile', ['$compile', function ($compile) {
			return function (scope, element, attrs) {
				var ensureCompileRunsOnce = scope.$watch(
				  function (scope) {
				  	// watch the 'compile' expression for changes
				  	return scope.$eval(attrs.compile);
				  },
				  function (value) {
				  	// when the 'compile' expression changes
				  	// assign it into the current DOM
				  	element.html(value);

				  	// compile the new DOM and link it to the current
				  	// scope.
				  	// NOTE: we only compile .childNodes so that
				  	// we don't get into infinite loop compiling ourselves
				  	$compile(element.contents())(scope);

				  	// Use Angular's un-watch feature to ensure compilation only happens once.
				  	ensureCompileRunsOnce();
				  }
			  );
			};
		}]);
})();
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
(function () {
	'use strict';

	angular
		.module('app')
		.directive('dateTime', ['$interval', function ($interval) {
			return {
				templateUrl: "App/Templates/Global/dateTime.tpl.html",
				link: function (scope, el, attr) {

					var tick = function () {
						scope.clock = moment(new Date).format("LTS");
					}

					tick();

					$interval(tick, 1000);

					return;

				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('featuredPosts', ['FeaturedService', function (FeaturedService) {
			return {
				restrict:'E',
				templateUrl: "App/Templates/Global/featuredPosts.tpl.html",
				link: function (scope, el, attr) {

					FeaturedService.getFeatured(attr.category).then(function (response) {
						scope.featured = _.orderBy(response.data.news, 'publishDate', 'desc');

						if (attr.category === "events") {
							scope.postType = "Events";
							scope.featured = _.orderBy(scope.featured, ['publishDate'], ['asc']);
						} else {
							scope.postType = "Posts";
						}


					});

					
				}
			};
		}]);
})();
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
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmGeocodezip', ['$http', function ($http) {
			return {
				controller: ['$http', '$scope', function ($http, $scope) {
					var geo = this;
					var vm = $scope.vm;

					geo = {
						geocodeZip: geocodeZip,
						setFormFields: setFormFields
					}

					return geo;

					function geocodeZip(zip) {
						return $http({
							url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&sensor=true',
							method: 'GET',
							headers: {
								'Authorization': undefined,
								'Access-Control-Allow-headers': undefined,
								'AccessControlAllowHeaders': undefined
							}
						});
					}

					function setFormFields(components) {
						vm.address.postalCode = components.postalCode;
						if(components.country){
							vm.address.country = components.country;
						}
						if (components.locality) {
							vm.address.city = components.locality;
						}
						if (components.administrative_area_level_1) {
							vm.address.state = components.administrative_area_level_1
						}
					}
					
				}],
				controllerAs: 'geo',
				scope:false,
				link: function (scope, el, attr, geo) {
					var element = el.context;
					element.addEventListener('keyup', function () {
						if (this.value.length >= 5) {
							var val = $.trim(this.value);
							geo.geocodeZip(val)
								.then(function (res) {
									if (res.status === 200 && res.data && res.data.results && res.data.results.length > 0) {
										
										var address_components = res.data.results[0].address_components;
										var components = {};
										$.each(address_components, function (k, v1) {
											$.each(v1.types, function (k2, v2) {
												components[v2] = v1.long_name
											});
										})
									}
									components.postalCode = val;
									return components;
								})
								.then(geo.setFormFields)
								.catch(function(err){
									console.log(err)
								});
						}
					});

				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmGetlatlongfromzip', ['$http', function ($http) {
			return {
				controller: ['$http', '$scope', function ($http, $scope) {
					var geo = this;

					geo = {
						geocodeZip: geocodeZip
					}

					return geo;

					function geocodeZip(zip) {
						return $http({
							url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&sensor=true',
							method: 'GET',
							headers: {
								'Authorization': undefined,
								'Access-Control-Allow-headers': undefined,
								'AccessControlAllowHeaders': undefined
							}
						});
					}


				}],
				controllerAs: 'geo',
				scope: false,
				link: function (scope, el, attr, geo) {
					var element = el.context;

					function getLatLong() {
						if (this.value.length >= 5) {
							scope.addLoading();
							var val = $.trim(this.value);

							geo.geocodeZip(val)
								.then(function (res) {
									if (res.status === 200 && res.data && res.data.results && res.data.results.length > 0) {
										console.log(res.data.results[0]);
										if (scope.vm.user) {
											scope.vm.user.latitude = res.data.results[0].geometry.location.lat;
											scope.vm.user.longitude = res.data.results[0].geometry.location.lng;
										} else if (scope.prayVm && scope.prayVm.newPrayer) {
											scope.prayVm.newPrayer.location = {};
											scope.prayVm.newPrayer.location.lat = res.data.results[0].geometry.location.lat;
											scope.prayVm.newPrayer.location.lon = res.data.results[0].geometry.location.lng;
											console.log(scope.prayVm.newPrayer);
										}
										
									}
								})
								.catch(function (err) {
									console.log(err);
									scope.vm.user.latitude = 0;
									scope.vm.user.longitude = 0;
								})
								.finally(function () {
									scope.hideLoading();
								});

						}
					}
					
					//element.addEventListener('keyup', _.throttle(getLatLong, 1000));
					element.addEventListener('keypress', _.throttle(getLatLong, 1000));

				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmHeader', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/header.tpl.html",
				controller:["$state", "$scope", function($state, $scope){
					var vm = this;
					vm.isShown = true;
					$scope.$on('$stateChangeSuccess', function () {
						if ($state.current.name === "home") {
							vm.isShown = false;
							angular.element('body').addClass('home');
						} else {
							angular.element('body').removeClass('home');
						}
					});
					return vm;
				}],
				controllerAs:"vm"
			};
		});
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('navigation', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Global/nav.tpl.html",
				link: function (scope, el, attr) {
					$(el).on('click', function (e) {
						if (e.target.tagName === "A") {
							$('.navbar-nav').removeClass('opened');
						}
					})
				}
			};
		})
		.directive('classWhenSticky', ['$window', '$location', function ($window, $location) {
			var $win = angular.element($window);
			return {
				link: function (scope, element, attrs) {
					var topClass = attrs.classWhenSticky, 
						offsetTop = element.offset().top;
					$win.on('scroll', function (e) {
						if ($win.scrollTop() > offsetTop + $win.height()) {
							element.addClass(topClass);
						} else {
							if ($location.hash() == "") {
								element.removeClass(topClass);
							}
						}
					});
				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
        .module('app')
		.directive('infiniteScroll', ['$parse', '$window', function ($parse, $window) {
			return function ($scope, element, attrs) {
				var handler = $parse(attrs.infiniteScroll);
				angular.element($window).bind("scroll", function (evt) {
					var scrollTop = element[0].scrollTop,
						scrollHeight = element[0].scrollHeight,
						offsetHeight = element[0].offsetHeight;
					if (scrollTop === (scrollHeight - offsetHeight)) {
						$scope.$apply(function () {
							handler($scope);
						});
					}
				});
			};
		}])
})();
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
(function () {
	'use strict';

	angular
		.module('homePanelOne', [])
		.directive('twwmHomePanelOne', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelOne.tpl.html",
				link: function (scope, el, attr) {

					scope.playerVars = {
						controls: 0,
						autoplay: 1,
						rel: 0,
						showinfo: 0,
						loop: 1
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
(function () {
	'use strict';

	angular
		.module('homePanelThree', [])
		.directive('twwmHomePanelThree', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelThree.tpl.html"
			};
		});
})();
(function () {
	'use strict';

	angular
		.module('homePanelTwo', [])
		.directive('twwmHomePanelTwo', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Home/homePanelTwo.tpl.html"
			};
		});
})();
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
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmConnect', ['$http', 'twwmConfig', 'UserService', 'ReadService', 'ResponseService', function ($http, twwmConfig, UserService, ReadService, ResponseService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmConnect.tpl.html",
				scope: false,
				controllerAs: 'connectVm',
				controller: function () {
					var connectVm = this;

					connectVm = {
						fbFeed: ''
					}
					
					return connectVm;
					
				},
				link: function (scope, el, attr, readVm) {
					
				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.filter('activityIcon', function () {
			return function (val) {
				switch (val) {
					case "1":
						return 'dn-icon-walk';
						break;
					case "2":
						return 'dn-icon-run';
						break;
					case "15":
					case "8":
					case "11":
					case "10":
					case "9":
						return 'dn-icon-evangelise';
						break;
					case "7":
						return 'dn-icon-other';
						break;
					default:
						return 'dn-icon-flame';
				}
				
			};
		})
		.directive('twwmMobilise', ['ActivityService', 'EvangelismService', function (ActivityService, EvangelismService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmMobilise.tpl.html",
				controllerAs: 'mobiliseVm',
				controller: function () {
					var mobiliseVm = this;

					mobiliseVm = {
						archives: [],
						getArchive: getArchive
					}

					mobiliseVm.getArchive();

					return mobiliseVm;

					function getArchive() {

						ActivityService.getActivities('0')
							.then(function (res) {
								angular.forEach(res.data.content, function (activity) {
									mobiliseVm.archives.push(activity);
								});
							})
							.catch(function (err) {
								console.log(err);
							});

						EvangelismService.getActivities('0')
							.then(function (res) {
								angular.forEach(res.data.content, function (activity) {
									mobiliseVm.archives.push(activity);
								});
							})
							.catch(function (err) {
								console.log(err);
							});
					}
				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmPray', ['$http', '$rootScope', 'twwmConfig', 'UserService', 'ResponseService', 'PrayerService', 'MapService', 'localStorageService', function ($http, $rootScope, twwmConfig, UserService, ResponseService, PrayerService, MapService, localStorageService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmPray.tpl.html",
				scope: false,
				controllerAs: 'prayVm',
				controller: function () {
					var prayVm = this;

					prayVm = {
						archives: [],
						createPrayer: createPrayer,
						getArchive: getArchive,
						isCreating: false,
						newPrayer: {},
						startCreating: startCreating,
						stopCreating: stopCreating,
						username: $rootScope.currentUser.username,
						users:[]
					}

					if (_.isEmpty($rootScope.currentUser)) {
						UserService.getUser()
							.then(UserService.storeUser)
							.catch(ResponseService.error);
					}

					$rootScope.$watch('currentUser.username', function (oldValue, newValue) {
						prayVm.newPrayer.username = prayVm.username = $rootScope.currentUser.username;
						prayVm.newPrayer.photoUrl = $rootScope.currentUser.photoUrl;
					});
						

					prayVm.getArchive();

					return prayVm;

					function startCreating(type) {
						prayVm.newPrayer.type = type;
						prayVm.isCreating = true;
					}

					function stopCreating() {
						prayVm.isCreating = false;
						prayVm.postalCode = '';
						prayVm.newPrayer.date = '';

						if (prayVm.newPrayer.location) {
							delete prayVm.newPrayer.location;
						}
						if (prayVm.newPrayer.date) {
							delete prayVm.newPrayer.date;
						}
					}

					function getArchive() {
						console.time('getArchive');
						$http({
							method: "GET",
							url: twwmConfig.contentEndpoint + '/pray/all/0',
							headers: {
								'Authorization': 'Bearer ' + UserService.getToken()
							}
						}).then(function (response) {
							prayVm.archives = _.orderBy(response.data.content, 'posted', 'desc');
							
							getArchiveDetails();
						}).catch(function (err) {
							console.log(err);
							ResponseService.error(err);
						});
					}

					function getArchiveDetails() {

						angular.forEach(prayVm.archives, function (prayer, i) {

							if (prayer.anonymous) {
								return;
							}

							UserService.getUserDetails(prayer.username)
								.then(function (res) {
									prayVm.archives[i].firstName = res.data.firstName;
									prayVm.archives[i].lastName = res.data.lastName;
								})
								.catch(function (err) {
									console.log(err);
									ResponseService.error(err);
								});
						});

						//console.timeEnd('getArchive');
					}

					function createPrayer() {

						$rootScope.addLoading();

						if (!prayVm.newPrayer.location) {
							var latLng = UserService.getLatLng();

							prayVm.newPrayer.location = {
								lat: latLng[0],
								lon: latLng[1]
							}
						}
						

						if (!_.isNull(prayVm.newPrayer.date)) {
							var date = new Date(prayVm.newPrayer.date);
							prayVm.newPrayer.posted = date.toUTCString();
						} else {
							prayVm.newPrayer.posted = $rootScope.createTimeStamp();
						}

						PrayerService.create(prayVm.newPrayer)
							.then(function (response) {
								
								var lat = response.data.location.lat || UserService.getLatLng()[0];
								var lng = response.data.location.lon || UserService.getLatLng()[1];
								MapService.createPin(response.data.type, response.data.identity.contentId, response.data.identity.contentClass, lat, lng)
								.then(function (res) {
									console.log(res);
									getArchive();
									MapService.createMap();
									stopCreating();
								})
								.catch(function (err) {
									console.log(err);
								});

								

							}).catch(function (err) {
								console.log(err);
								ResponseService.error(err);
							})
							.finally(function () {
								$rootScope.hideLoading();
							});
					}


				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmReach', ['$http', 'twwmConfig', 'UserService', 'ProvidedContentService', 'ResponseService', function ($http, twwmConfig, UserService, ProvidedContentService, ResponseService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmReach.tpl.html",
				scope: false,
				controllerAs: 'reachVm',
				controller: function () {
					var reachVm = this;

					reachVm = {
						archives: [],
						getArchive: getArchive
					}

					reachVm.getArchive();

					return reachVm;

					function getArchive() {

						ProvidedContentService.getIndex('reach')
							.then(function (response) {

								$.each(response.data.content, function (i, v) {
									var postPublishDate = moment(v.publishDate, moment.ISO_8601);
									if (moment(new Date(), moment.ISO_8601).isAfter(postPublishDate)) {
										reachVm.archives.push(response.data.content[i])
									}
								});

								reachVm.archives = _.orderBy(reachVm.archives, 'publishDate', 'desc');

							})
							.catch(ResponseService.error);
					}

				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmRead', ['$http', 'twwmConfig', 'UserService', 'ResponseService', 'ProvidedContentService', function ($http, twwmConfig, UserService, ResponseService, ProvidedContentService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmRead.tpl.html",
				scope: false,
				controllerAs:'readVm',
				controller: function(){
					var readVm = this;
					
					readVm = {
						archives: [],
						getArchive: getArchive
					}

					readVm.getArchive();

					return readVm;

					function getArchive() {

						ProvidedContentService.getIndex('read')
							.then(function (response) {

								$.each(response.data.content, function (i, v) {
									var postPublishDate = moment(v.publishDate, moment.ISO_8601);
									if (moment(new Date(), moment.ISO_8601).isAfter(postPublishDate)) {
										readVm.archives.push(response.data.content[i])
									}
								});

								readVm.archives = _.orderBy(readVm.archives, 'publishDate', 'desc');

							})
							.catch(ResponseService.error);
					}
				}
			};
		}]);
})();
(function () {
	'use strict';

	angular
		.module('app')
		.directive('participateNavigation', function () {
			return {
				restrict: "E",
				templateUrl: "App/Templates/Participate/navigation.tpl.html"
			};
		});
})();
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