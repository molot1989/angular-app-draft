angular.module('angularApp', ['ui.router','ngAnimate'])
    .config(['$locationProvider','$stateProvider', function($locationProvider,$stateProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/templates/home.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'modules/templates/about.html'
            });

    }]);