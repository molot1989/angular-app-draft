angular.module('angularApp', ['ui.router','ngAnimate','videolist','gapi','yaru22.angular-timeago'])
    .config(['$locationProvider','$stateProvider', function($locationProvider,$stateProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/templates/home.html'
            })
            .state('user', {
                url: '/user/:id/:title',
                templateUrl: 'modules/templates/channel.html'
            })
            .state('channel', {
                url: '/channel/:id',
                templateUrl: 'modules/templates/channel.html'
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
    .controller('watchCtrl',['$scope', '$rootScope', '$http','$stateParams','$sce', '$timeout',  function ($scope, $rootScope, $http, $stateParams, $sce, $timeout) {
        function getView(video_ID){
            $rootScope.video = {related:[]};
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id='+video_ID+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                $rootScope.video = response;
                $rootScope.video.related = [];
                $rootScope.video.titleLink = $rootScope.video.data.items[0].snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                $rootScope.video.src = 'https://www.youtube.com/watch?v='+response.data.items[0].id;
                $rootScope.video.src = $sce.trustAsResourceUrl($rootScope.video.src);
                $timeout(function () {
                    $('video').mediaelementplayer({
                        success: function(media, node, player) {
                            console.log(media.pluginType)
                            $('#' + node.id + '-mode').html('mode: ' + media.pluginType);
                        }
                    });
                })
                getRelatedVideo(response.data.items[0].id);
            }, function errorCallback(response) {

            });
        }
        function getRelatedVideo(id){
            console.log('getRelatedVideo')
            var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&relatedToVideoId='+id+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                $rootScope.video.related = response.data.items
                angular.forEach($rootScope.video.related, function(value, key) {
                    try{
                        value.titleLink = value.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                    }catch(e){

                    }
                });

            }, function errorCallback(response) {

            });
        }
        getView($stateParams.id);
    }])
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
        $rootScope.pageToken = '';
            String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };
    }])
    .controller('searchController', ['$scope', '$rootScope', 'Youtube', '$timeout' ,'$http','$stateParams', '$state','$q', function($scope, $rootScope, Youtube, $timeout, $http, $stateParams,$state,$q) {
        var arr = [
            {
                url : 'animation',
                videoCategoryId: 1,
                videoCategoryName: 'Film & Animation'
            },
            {
                url : 'auto-vehicles',
                videoCategoryId: 2,
                videoCategoryName: 'Autos & Vehicles'
            },
            {
                url : 'comedy',
                videoCategoryId: 23,
                videoCategoryName: 'Comedy'
            },
            {
                url : 'gaming',
                videoCategoryId: 20,
                videoCategoryName: 'Entertainment'
            },
            {
                url : 'howto',
                videoCategoryId: 26,
                videoCategoryName: 'Howto & Style'
            },
            {
                url : 'movies',
                videoCategoryId: 30,
                videoCategoryName: 'Movies'
            },
            {
                url : 'music',
                videoCategoryId: 10,
                videoCategoryName: 'Music'
            }
        ]
        $rootScope.pageToken=[];
        $rootScope.videoList=[];
        $rootScope.videoCategoryName=[];
        $rootScope.videoCategoryid=[];
        $rootScope.videoCategoryChannelName='';
        function getViewChannel(val){
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+val.id.videoId+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                angular.forEach($rootScope.videoList, function(value, key) {
                    try{
                        if(val.id.videoId == value.id.videoId){
                            value.statistics = response.data.items[0].statistics;
                        }
                    }catch(e){

                    }
                });
            }, function errorCallback(response) {

            });

        }
        $scope.search = function(q){
            if(event.which === 13 || event.type === "blur") {
                $state.go('channel')
                var data = Youtube.search({ part: 'snippet', q: event.target.name, maxResults: 20, pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video'})
                var getData = setInterval(function(){
                    if(typeof data !="undefined" && data['$$state'].value){
                        $rootScope.pageToken = data['$$state'].value.nextPageToken
                        $rootScope.videoList = data['$$state'].value.items;
                        $rootScope.videoCategoryName = 'Search'
                        $rootScope.videoCategoryChannelName = 'Search'
                        angular.forEach($rootScope.videoList, function(value, key) {
                            try{
                                getViewChannel(value)
                            }catch(e){

                            }
                        });
                        $rootScope.$apply();

                    }
                    clearInterval(getData);
                },10)
            }
        }
    }])
        .controller('videoController', ['$scope', '$rootScope', 'Youtube', '$timeout' ,'$http','$stateParams', '$state','$q', function($scope, $rootScope, Youtube, $timeout, $http, $stateParams,$state,$q){
        var arr = [
            {
                url : 'animation',
                videoCategoryId: 1,
                videoCategoryName: 'Film & Animation'
            },
            {
                url : 'auto-vehicles',
                videoCategoryId: 2,
                videoCategoryName: 'Autos & Vehicles'
            },
            {
                url : 'comedy',
                videoCategoryId: 23,
                videoCategoryName: 'Comedy'
            },
            {
                url : 'gaming',
                videoCategoryId: 20,
                videoCategoryName: 'Entertainment'
            },
            {
                url : 'howto',
                videoCategoryId: 26,
                videoCategoryName: 'Howto & Style'
            },
            {
                url : 'movies',
                videoCategoryId: 30,
                videoCategoryName: 'Movies'
            },
            {
                url : 'music',
                videoCategoryId: 10,
                videoCategoryName: 'Music'
            }
        ]
        $rootScope.pageToken=[];
        $rootScope.videoList=[];
        $rootScope.videoCategoryName=[];
        $rootScope.videoCategoryid=[];
        $rootScope.videoCategoryChannelName='';

        function getViewChannel(val){
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+val.id.videoId+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                angular.forEach($rootScope.videoList, function(value, key) {
                    try{
                        if(val.id.videoId == value.id.videoId){
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
            $scope.videos($stateParams.id ? $stateParams : 22).then(function (data) {
                $rootScope.pageToken = data.value.nextPageToken
                $rootScope.videoList = data.value.items;
                $rootScope.videoCategoryName = data.videoCategoryName;
                angular.forEach($rootScope.videoList, function(value, key) {
                    try{
                        value.titleLink = value.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                        getViewChannel(value)
                    }catch(e){

                    }
                });
            })
        }
        $scope.search = function(q){
            if(event.which === 13 || event.type === "blur") {
                $state.go('channel')
                var data = Youtube.search({ part: 'snippet', q: event.target.name, maxResults: 20, pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video'})
                var getData = setInterval(function(){
                    if(typeof data !="undefined" && data['$$state'].value){
                        $rootScope.pageToken = data['$$state'].value.nextPageToken
                        $rootScope.videoList = data['$$state'].value.items;
                        $rootScope.videoCategoryName = 'Search'
                        $rootScope.videoCategoryChannelName = 'Search'
                        angular.forEach($rootScope.videoList, function(value, key) {
                            try{
                                getViewChannel(value)
                            }catch(e){

                            }
                        });
                        $rootScope.$apply();

                    }
                    clearInterval(getData);
                },10)
            }
        }
        $scope.videos = function(videoCategory){
            var deferred = $q.defer();
            var videoCategoryId = 22
            var videoCategoryName = 'Popular'
            switch(videoCategory.id){
                case 'animation':
                    videoCategoryId = 1;
                    videoCategoryName = 'Film & Animation';
                    break;
                case 'auto-vehicles':
                    videoCategoryId = 2;
                    videoCategoryName = 'Autos & Vehicles';
                    break;
                case 'comedy':
                    videoCategoryId = 23;
                    videoCategoryName = 'Comedy'
                    break;
                case 'gaming':
                    videoCategoryId = 20;
                    videoCategoryName = 'Entertainment'
                    break;
                case 'howto':
                    videoCategoryId = 26;
                    videoCategoryName = 'Howto & Style'
                    break;
                case 'movies':
                    videoCategoryId = 30;
                    videoCategoryName = 'Movies'
                    break;
                case 'music':
                    videoCategoryId = 10;
                    videoCategoryName = 'Music'
                    break;
                case 'news':
                    videoCategoryId = 25;
                    videoCategoryName = 'News & Politics'
                    break;
                case 'people':
                    videoCategoryId = 22;
                    videoCategoryName = 'Popular'
                    break;
                case 'science':
                    videoCategoryId = 28;
                    videoCategoryName = 'Science & Technology'
                    break;
                case 'sports':
                    videoCategoryId = 17;
                    videoCategoryName = 'Sports'
                    break;
                default:
                    videoCategoryId = 22;
                    videoCategoryName = 'Popular'
            }
            var data = Youtube.search({ part: 'snippet', maxResults: ($state.current.name == 'channel' || $state.current.name == 'user' ? 20 : 5), pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video', videoCategoryId: videoCategoryId })

            var getData = setInterval(function(){
                if(typeof data !="undefined" && data['$$state'].value){
                    data['$$state'].videoCategoryName=videoCategoryName;
                    data['$$state'].videoCategoryid=videoCategory.id;
                    deferred.resolve(data['$$state']);
                    console.log(data['$$state'])

                    clearInterval(getData);
                }
            },10)
            return deferred.promise;
        }
        function getView(val, index){
            var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+val.id.videoId+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                angular.forEach($rootScope.videoList[index], function(value, key) {
                    try{
                        if(val.id.videoId == value.id.videoId){
                            value.statistics = response.data.items[0].statistics;
                        }
                    }catch(e){

                    }
                });
            }, function errorCallback(response) {

            });

        }
        $scope.getData = function (arr) {
            if($state.current.name == 'channel'|| $state.current.name == 'user'|| $state.current.name == ''){ return ;}
            var tmpObj = arr.shift();
            if (typeof tmpObj == 'object') {
                $scope.videos({id:tmpObj['url']}).then(function (data) {
                    if($state.current.name == 'channel'){ return ;}
                        $rootScope.pageToken[arr.length]          = data.value.nextPageToken;
                        $rootScope.videoList[arr.length]          = data.value.items;
                        $rootScope.videoCategoryName[arr.length]  = data.videoCategoryName;
                        $rootScope.videoCategoryid[arr.length]    = data.videoCategoryid;
                        angular.forEach($rootScope.videoList[arr.length], function(value, key) {
                            try{
                                value.titleLink = value.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                                getView(value, arr.length)
                            }catch(e){

                            }
                        });
                    $scope.getData(arr);
                })
            }else{
                return ;
            }
        }
        $scope.getData(arr);

        $scope.videos($stateParams.id ? $stateParams : 22).then(function (data) {
            if($state.current.name != 'channel'){ return ;}
            $rootScope.pageToken = data.value.nextPageToken
            $rootScope.videoList = data.value.items;
            $rootScope.videoCategoryChannelName = data.videoCategoryName;
            $rootScope.videoCategoryid = data.videoCategoryid;
            angular.forEach($rootScope.videoList, function(value, key) {
                try{
                    value.titleLink = value.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                    getViewChannel(value);
                }catch(e){

                }
            });
        })
        $scope.videosUser = function(channelId){
            var deferred = $q.defer();
            var videoCategoryId = 22
            var videoCategoryName = 'videoCategory'
            var data = Youtube.search({ part: 'snippet', maxResults: ($state.current.name == 'user' ? 20 : 5), pageToken: $rootScope.pageToken ? $rootScope.pageToken : '', type : 'video', channelId: channelId.id })

            var getData = setInterval(function(){
                if(typeof data !="undefined" && data['$$state'].value){
                    if($state.current.name != 'user'){ return ;}
                    data['$$state'].videoCategoryName=videoCategoryName;
                    data['$$state'].videoCategoryid=channelId.id;
                    deferred.resolve(data['$$state']);
                    clearInterval(getData);
                }
            },10)
            return deferred.promise;
        }
        $scope.videosUser($stateParams).then(function (data) {
            if($state.current.name != 'user'){ return ;}
            $rootScope.pageToken = data.value.nextPageToken
            $rootScope.videoList = data.value.items;
            $rootScope.videoCategoryChannelName = data.videoCategoryName;
            $rootScope.videoCategoryid = data.videoCategoryid;
            angular.forEach($rootScope.videoList, function(value, key) {
                try{
                    value.titleLink = value.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                    getViewChannel(value);
                }catch(e){

                }
            });
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

