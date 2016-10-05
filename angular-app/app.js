angular.module('angularApp', ['ui.router','ngAnimate','videolist','gapi','yaru22.angular-timeago','watchPage'])
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
    .value('GoogleApp', {
        apiKey: 'AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo',
        clientId: 'foRSlfFamL6agj4aOBKSVz07',
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    })
    .controller('videoController', ['$scope', '$rootScope', 'Youtube', '$timeout' ,'$http', function($scope, $rootScope, Youtube, $timeout, $http){
        $rootScope.videoList = [];
        function getView(video_ID){
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+video_ID+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                angular.forEach($rootScope.videoList, function(value, key) {
                    if(value.id.videoId==response.data.items[0].id){
                        value.statistics = response.data.items[0].statistics;
                    }
                });
            }, function errorCallback(response) {

            });

        }

        $scope.videos = function(q){
            var data = Youtube.search({ part: 'snippet', q: q })
            $timeout(function(){
                if(typeof data !="undefined"){
                    $rootScope.videoList = data['$$state'].value.items;
                    angular.forEach($rootScope.videoList, function(value, key) {
                        getView(value.id.videoId)
                    });
                    $rootScope.$apply();

                }
            },500)

        }

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

