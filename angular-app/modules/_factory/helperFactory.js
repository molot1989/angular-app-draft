/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .factory('helperFactory',['$q','$rootScope','categoryFactory', 'Youtube','$http', function($q, $rootScope, categoryFactory, Youtube,$http) {

        var videoData = {
            pageToken:         [],
            videoList:         [],
            videoCategoryName: [],
            videoCategoryid:   []
        };

        function getData(arr, state, pageToken) {
            var tmpObj = arr.shift();
            if (typeof tmpObj == 'object') {
                getYoutubeData(tmpObj, state, pageToken).then(function (data) {
                    videoData.pageToken[arr.length]         = data.value.nextPageToken;
                    videoData.videoList[arr.length]         = data.value.items;
                    videoData.videoCategoryName[arr.length] = data.videoCategoryName;
                    videoData.videoCategoryid[arr.length]   = data.videoCategoryid;
                    getData(arr, state, pageToken);
                })
            } else {
                $rootScope.video = {
                    list                : videoData.videoList,
                    categoryName        : videoData.videoCategoryName,
                    categoryChannelName : videoData.videoCategoryChannelName,
                    pageToken           : videoData.pageToken
                }

                getStatics($rootScope.video.list);
            }
        }

        function getSearchData(categoryName, state, pageToken, search){
            getYoutubeData(categoryName, state, pageToken, search).then(function (data) {
                videoData.pageToken[0]         = data.value.nextPageToken;
                videoData.videoList[0]         = data.value.items;
                videoData.videoCategoryName[0] = data.videoCategoryName;
                videoData.videoCategoryid[0]   = data.videoCategoryid;
                $rootScope.video = {
                    list                : videoData.videoList,
                    categoryName        : videoData.videoCategoryName,
                    categoryChannelName : videoData.videoCategoryChannelName,
                    pageToken           : videoData.pageToken
                }
            })
        }
        function getUserData(categoryName, state, pageToken){
            getYoutubeData(categoryName, state, pageToken).then(function (data) {
                videoData.pageToken[0]         = data.value.nextPageToken;
                videoData.videoList[0]         = data.value.items;
                videoData.videoCategoryName[0] = data.videoCategoryName;
                videoData.videoCategoryid[0]   = data.videoCategoryid;
                $rootScope.video = {
                    list                : videoData.videoList,
                    categoryName        : videoData.videoCategoryName,
                    categoryChannelName : videoData.videoCategoryChannelName,
                    pageToken           : videoData.pageToken
                }
            })
        }

        function getYoutubeData(categoryName, state, pageToken, search){
            var deferred          = $q.defer(),
                videoCategoryId   = categoryName.videoCategoryId,
                videoCategoryName = categoryName.videoCategoryName,
                data = Youtube.search({
                    part           : 'snippet',
                    maxResults     : (state.current.name == 'home'  ? 5 : 20),
                    pageToken      : pageToken ? pageToken : null,
                    type           : 'video',
                    videoCategoryId: videoCategoryId ? videoCategoryId : null,
                    channelId      : (state.current.name == 'user' ? state.params.id ? state.params.id : null : null),
                    q              : (search ? search : null)
                })

            var getData = setInterval(function(){
                if(typeof data !="undefined" && data['$$state'].value){
                    data['$$state'].videoCategoryName = videoCategoryName;
                    data['$$state'].videoCategoryid   = videoCategoryId;
                    deferred.resolve(data['$$state']);

                    clearInterval(getData);
                }
            },10)
            return deferred.promise;
        }

        function getStatics(videoCategory, index) {
            angular.forEach(videoCategory, function (videoList, key) {
                angular.forEach(videoList, function (video, key) {
                    video.titleLink = video.snippet.title.replaceAll(' ', '-').replaceAll('/', '');
                    addStat(video).then(function (stat) {
                        video.statistics = stat;
                    })
                });
            })

            function addStat(val){
                var deferred = $q.defer();
                var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+val.id.videoId+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
                $http({
                    method: 'GET',
                    url: url
                }).then(function successCallback(response) {
                    deferred.resolve(response.data.items[0].statistics);
                }, function errorCallback(response) {

                });
                return deferred.promise;
            }
        }
        return {
            getData: getData,
            getYoutubeData: getYoutubeData,
            getStatics: getStatics,
            getSearchData: getSearchData,
            getUserData: getUserData
        };
    }]);