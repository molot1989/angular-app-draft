/**
 * Created by semianchuk on 07.10.16.
 */
angular.module('angularApp')
    .factory('categoryFactory',[ function() {
        var categories = [
            {
                url : 'people',
                videoCategoryId: 22,
                videoCategoryName: 'Popular'
            },
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
            },
            {
                url : 'news',
                videoCategoryId: 25,
                videoCategoryName: 'News & Politics'
            },
            {
                url : 'science',
                videoCategoryId: 28,
                videoCategoryName: 'Science & Technology'
            },
            {
                url : 'sports',
                videoCategoryId: 17,
                videoCategoryName: 'Sports'
            }
        ]
            function getCategories(url) {
                var category = [];
                if(url){
                    angular.forEach(categories,function (val, ind) {
                        if(val.url == url){
                            category.push(val);
                        }
                    })
                }else{
                    category = categories;
                }
                return category;
            }
        return {
            getCategories: getCategories
        };
    }]);