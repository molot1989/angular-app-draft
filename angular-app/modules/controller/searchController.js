/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .controller('searchController',
           ['$scope',
            '$rootScope',
            '$state',
            'helperFactory',
            'categoryFactory', function($scope, $rootScope, $state,helperFactory, categoryFactory) {
                   var arr = angular.copy(categoryFactory.getCategories($state.params.id)),
                       search = '';
                   $rootScope.video           =[];
                   $rootScope.video.pageToken =[];

                   $scope.nextSearch = function(){
                       $rootScope.videoList = [];
                       helperFactory.getSearchData(arr, $state, $rootScope.video.pageToken[0], $state.params.id);
                   }
                    $scope.search = function(event){
                        if(event.which === 13 || event.type === "blur") {
                            $state.go('search', { "id": event.target.value})
                            helperFactory.getSearchData(arr, $state, $rootScope.video.pageToken[0], event.target.value);
                        }
                    }
           }]);