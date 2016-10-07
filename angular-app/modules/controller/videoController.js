/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .controller('videoController',
        ['$scope',
        '$rootScope',
        'Youtube',
        '$timeout' ,
        '$http',
        '$stateParams',
        '$state',
        '$q',
        'categoryFactory',
        'helperFactory',
        function($scope, $rootScope, Youtube, $timeout, $http, $stateParams,$state,$q,categoryFactory,helperFactory){
            var arr = angular.copy(categoryFactory.getCategories($state.params.id));

            $rootScope.video     =[];
            $rootScope.pageToken =[];

            helperFactory.getData(arr, $state);
            
            $scope.next = function(){
                $rootScope.videoList = [];
                helperFactory.getData(angular.copy(categoryFactory.getCategories($state.params.id)), $state, $rootScope.video.pageToken[0]);
            }
            
        }]);