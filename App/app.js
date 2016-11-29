(function () {
	'use strict';

	angular
        .module('app', ['ui.router', 'ngCookies', 'ngAnimate', 'angularMoment', 'home'])
        .config(config)
        .run(run)
		.filter('unsafe', function ($sce) {
			return function (val) {
				return $sce.trustAsHtml(val);
			};
		})
		.constant('apiHost', 'https://qamobilize-web-381809290.us-east-1.elb.amazonaws.com/uaa');

	config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function config($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				templateUrl: 'App/Templates/Home/home.tpl.html',
				controllerAs: 'vm'
			})
			.state('login', {
				controller: 'LoginController',
				templateUrl: 'App/Templates/Account/login.tpl.html',
				controllerAs: 'vm'
			})
			.state('register', {
				controller: 'RegisterController',
				templateUrl: 'App/Templates/Account/register.tpl.html',
				controllerAs: 'vm'
			})
			.state('blog', {
				url:'/blog',
				controller: 'BlogController',
				templateUrl: 'App/Templates/Blog/blog.tpl.html',
				controllerAs: 'vm'
			})
			.state('participate', {
				url: '/participate',
				controller: 'ParticipateController',
				templateUrl: 'App/Templates/participate.tpl.html',
				controllerAs: 'vm'
			})
			.state('dashboard', {
				url: '/dashboard',
				controller: 'DashboardController',
				templateUrl: 'App/Templates/Dashboard/dashboard.tpl.html',
				controllerAs: 'vm'
			})
			.state('division', {
				url: '/division',
				controller: 'DashboardController',
				templateUrl: 'App/Templates/Dashboard/dashboard.tpl.html',
				controllerAs: 'vm'
			})
			.state('profile', {
				url: '/profile',
				controller: 'MyaccountController',
				templateUrl: 'App/Templates/Account/profile.tpl.html',
				controllerAs: 'vm'
			})
			.state('events', {
				url: '/events',
				controller: 'EventsController',
				templateUrl: 'App/Templates/Events/events.tpl.html',
				controllerAs: 'vm'
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
			});
	}

	run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
	function run($rootScope, $location, $cookieStore, $http) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookieStore.get('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}

		$rootScope.$on('$routeChangeSuccess', function (ev, data) {
			if (data.$route && data.$route.controller)
				$rootScope.controller = data.$route.controller;
		})

		$rootScope.$on('$locationChangeStart', function (event, next, current) {
			// redirect to login page if not logged in and trying to access a restricted page
			var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				//$location.path('/login');
			}
		});

		$rootScope.toggleMobileNav = function (el) {
			console.log(el);
			var nav = angular.element(document.querySelector('#nav-primary'));
			if (nav.hasClass('opened')) {
				nav.removeClass('opened');
			} else {
				nav.addClass('opened');
			}
			
		}
	}

})();