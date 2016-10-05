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
            })

    }])
    .directive("channelsList",[ function () {
        return {
            link: function (scope, element, attrs) {
                scope.data = scope[attrs["channelsList"]];
            },
            restrict: "A",
            template: "<ul class=\"channels\"><li ng-repeat='item in data'><a href='{{item.url}}'>{{item.name}}</a></li></ul>"
        }
    }])

    .controller("channelsCtrl",['$scope', function ($scope) {
        $scope.items = [
            {name:'Popular', url:'/'},
            {name:'Film & Animation', url:'/channel/animation'},
            {name:'Autos & Vehicles', url:'/channel/auto-vehicles'},
            {name:'Comedy', url:'/channel/comedy'},
            {name:'Gaming', url:'/channel/gaming'},
            {name:'Howto & Style', url:'/channel/howto'},
            {name:'Movies', url:'/channel/movies'},
            {name:'Music', url:'/channel/music'},
            {name:'News & Politics', url:'/channel/news'},
            {name:'People & Blog', url:'/channel/people'},
            {name:'Science & Technology', url:'/channel/science'},
            {name:'Sports', url:'/channel/sports'}
        ];
    }]);

