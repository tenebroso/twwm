(function () {
	'use strict';

	angular
        .module('app', ['ui.router', 'ngAnimate', 'angularMoment', 'home'])
        .config(config)
        .run(run)
		.filter('unsafe', function ($sce) {
			return function (val) {
				return $sce.trustAsHtml(val);
			};
		})
		.constant('twwmConfig', {
			'authEndpoint': '//qamobilize-web-381809290.us-east-1.elb.amazonaws.com/uaa',
			'publicEndpoint': 'https://webmanager.salvationarmy.org/mobilize_endpoint'
		});

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
				abstract:true,
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
				abstract:true,
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

	run.$inject = ['$rootScope', '$state', '$timeout'];
	function run($rootScope, $state, $timeout) {
		
		$rootScope.toggleMobileNav = function (el) {
			var nav = angular.element(document.querySelector('#nav-primary'));
			if (nav.hasClass('opened')) {
				nav.removeClass('opened');
			} else if($(window).width() < 991) {
				nav.addClass('opened');
			}
		}

		$rootScope.addLoading = function () {
			angular.element('body').addClass('loading');
		}

		$rootScope.hideLoading = function () {
			angular.element('body').removeClass('loading');
		}

		$rootScope.$on('$stateChangeStart', function () {
			$rootScope.addLoading();
		});
	}

})();