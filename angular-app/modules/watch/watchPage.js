angular.module('watchPage',[])
    .directive('watchPage', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: '/modules/watch/watchPage.html',
            link: function (scope, element, attrs, $rootScope) {
            }
        }
    });
