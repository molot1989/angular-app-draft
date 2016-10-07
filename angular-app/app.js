angular.module('angularApp',
                    ['ui.router',
                    'ngAnimate',
                    'videolist',
                    'gapi',
                    'yaru22.angular-timeago'])
    .config(['$locationProvider','$stateProvider', function($locationProvider,$stateProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/templates/home.html'
            })
            .state('user', {
                url: '/user/:id/:title',
                templateUrl: 'modules/templates/user.html'
            })
            .state('channel', {
                url: '/channel/:id',
                templateUrl: 'modules/templates/channel.html'
            })
            .state('search', {
                url: '/search/:id',
                templateUrl: 'modules/templates/search.html'
            })
            .state('watch', {
                url: '/watch/:id/:title',
                templateUrl: 'modules/templates/watch.html'
            })

    }])
    .value('GoogleApp', {
        apiKey: 'AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo',
        clientId: 'foRSlfFamL6agj4aOBKSVz07',
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    })
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })
    .run(['$rootScope', function($rootScope){
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };
    }])
    


