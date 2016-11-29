'use strict';

angular
    .module('app.routes', ['ngRoute'])
    .config(config);

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider) {
	$routeProvider.
        when('/', {
        	templateUrl: 'Sections/account.tpl.html',
        	controllerAs: 'vm'
        })
		.when('/login', {
			controller: 'LoginController',
			templateUrl: 'Sections/login.tpl.html',
			controllerAs: 'vm'
		})
		.when('/register', {
			controller: 'RegisterController',
			templateUrl: 'Sections/register.tpl.html',
			controllerAs: 'vm'
		})
        .otherwise({
        	redirectTo: '/'
        });
}