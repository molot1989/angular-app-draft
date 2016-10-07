/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
.controller('watchCtrl',['$scope', '$rootScope', '$http','$stateParams','$sce', '$timeout',  function ($scope, $rootScope, $http, $stateParams, $sce, $timeout) {
    function getView(video_ID){
        $rootScope.video = {related:[]};
        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id='+video_ID+'&key=AIzaSyDf-M6vHleltxG1jZI_PEn1mzdAT2YnEmo';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            $rootScope.video           = response;
            $rootScope.video.related   = [];
            $rootScope.video.titleLink = $rootScope.video.data.items[0].snippet.title.replaceAll(' ', '-').replaceAll('/', '');
            $rootScope.video.src       = 'https://www.youtube.com/watch?v='+response.data.items[0].id;
            $rootScope.video.src       = $sce.trustAsResourceUrl($rootScope.video.src);
            $timeout(function () {
                $('video').mediaelementplayer({
                    success: function(media, node, player) {
                        $('#' + node.id + '-mode').html('mode: ' + media.pluginType);
                    }
                });
            })
            getRelatedVideo(response.data.items[0].id);
        }, function errorCallback(response) {

        });
    }
    function getRelatedVideo(id){
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
}]);