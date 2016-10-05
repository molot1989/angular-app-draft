angular.module('angularApp', ['ui.router','ngAnimate','videolist','gapi','yaru22.angular-timeago'])
    .config(['$locationProvider','$stateProvider', function($locationProvider,$stateProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/templates/home.html'
            })
            .state('user', {
                url: '/user/:id',
                templateUrl: 'modules/templates/home.html'
            })
            .state('channel', {
                url: '/channel/:id',
                templateUrl: 'modules/templates/home.html'
            })
            .state('watch', {
                url: '/watch/:id',
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
    .controller('videoController', ['$scope', '$rootScope', 'Youtube', '$timeout' ,'$http','$stateParams', function($scope, $rootScope, Youtube, $timeout, $http, $stateParams){
        $rootScope.pageToken = ''
        $rootScope.videoList = [];
        function getView(video_ID){
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+video_ID+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                angular.forEach($rootScope.videoList, function(value, key) {
                    try{
                        if(value.id.videoId==response.data.items[0].id){
                            value.statistics = response.data.items[0].statistics;
                        }
                    }catch(e){

                    }
                });
            }, function errorCallback(response) {

            });

        }
        $scope.next = function(){
            $rootScope.videoList = [];
            $scope.videos($stateParams.id ? $stateParams : 'Popular')
        }
        $scope.search = function(q){
            if(event.which === 13 || event.type === "blur") {
                var data = Youtube.search({ part: 'snippet', q: event.target.name, maxResults: 20, pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video'})
                $timeout(function(){
                    if(typeof data !="undefined"){
                        $rootScope.pageToken = data['$$state'].value.nextPageToken
                        $rootScope.videoList = data['$$state'].value.items;
                        angular.forEach($rootScope.videoList, function(value, key) {
                            try{
                                getView(value.id.videoId)
                            }catch(e){

                            }
                        });
                        $rootScope.$apply();

                    }
                },1000)
            }
        }
        $scope.videos = function(videoCategoryId){
            var data = Youtube.search({ part: 'snippet', maxResults: 20, pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video', videoCategoryId: videoCategoryId })
            $timeout(function(){
                if(typeof data !="undefined"){
                    $rootScope.pageToken = data['$$state'].value.nextPageToken
                    $rootScope.videoList = data['$$state'].value.items;
                    angular.forEach($rootScope.videoList, function(value, key) {
                        try{
                            getView(value.id.videoId)
                        }catch(e){

                        }
                    });
                    $rootScope.$apply();

                }
            },1000)
        }
        var videoCategoryId = 22
        switch($stateParams.id){
            case 'animation':
                videoCategoryId = 1;
                break;
            case 'auto-vehicles':
                videoCategoryId = 2;
                break;
            case 'comedy':
                videoCategoryId = 23;
                break;
            case 'gaming':
                videoCategoryId = 20;
                break;
            case 'howto':
                videoCategoryId = 26;
                break;
            case 'movies':
                videoCategoryId = 30;
                break;
            case 'music':
                videoCategoryId = 10;
                break;
            case 'news':
                videoCategoryId = 25;
                break;
            case 'people':
                videoCategoryId = 22;
                break;
            case 'science':
                videoCategoryId = 28;
                break;
            case 'sports':
                videoCategoryId = 17;
                break;
            default:
                videoCategoryId = 22;
        }
        $scope.videos(videoCategoryId)

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

