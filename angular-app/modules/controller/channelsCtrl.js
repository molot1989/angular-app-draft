/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .controller("channelsCtrl",['$scope', 'categoryFactory', function ($scope, categoryFactory) {
        var categories = categoryFactory.getCategories();
        $scope.items = [];

        angular.forEach(categories, function (value, index) {
            $scope.items.push(
                {name:value.videoCategoryName, url:'/channel/'+value.url}
            )
        })
    }]);