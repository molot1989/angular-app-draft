angular.module('videolist',[])
    .directive('videoList', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: '/modules/videoList/videolist.html',
            link: function (scope, element, attrs, $rootScope) {
                attrs.$observe('list', function(value){
                    if(value){
                        scope.list = JSON.parse(value);
                        console.log(scope.list)
                    }
                });
            }
        }
    });
