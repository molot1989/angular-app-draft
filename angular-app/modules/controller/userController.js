/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .controller('userController',
        ['$scope',
            '$rootScope',
            '$state',
            'helperFactory',
            'categoryFactory', function($scope, $rootScope, $state,helperFactory, categoryFactory) {
            var arr = angular.copy(categoryFactory.getCategories($state.params.id)),
                search = '';
            $rootScope.video              =[];
            $rootScope.video.pageToken    =[];
            helperFactory.getUserData(arr, $state, $rootScope.video.pageToken[0]);

            $scope.next = function(){
                $rootScope.videoList = [];
                helperFactory.getUserData(arr, $state, $rootScope.video.pageToken[0]);
            }
        }]);