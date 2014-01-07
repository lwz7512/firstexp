'use strict';

var mm = angular.module('ngappApp');


function _localSave(key, value) {
  if(window.localStorage){
    window.localStorage.setItem(key, value);
  }
}

function _localFetch(key) {
  if(window.localStorage){
    return window.localStorage.getItem(key);
  }
  return null;
}


/* 主页面控制器 */
mm.controller('MainCtrl', function ($scope, $http, $log) {
    //init state
    $scope.display = true;

    var cachedCategories = _localFetch('categories');
    if(cachedCategories){
      $scope.display = false;//hide the loading text
      $scope.categories = cachedCategories;
      mm['subcategories'] = cachedCategories;//save the categories for next page use

      return;//break the data fetch step!
    }

    $http.get('/json/classify.json').success(function(data){

      $scope.display = false;//hide the loading text
    	$scope.categories = data.categories;
      mm['subcategories'] = data.categories;//save the categories for next page use

      _localSave('categories', data.categories);//cache the list in first load

    }).error(function(data){
    	$log.log('data load error!');
    });
});

/* 子分类控制器 */
mm.controller('SubCategoryCtrl', function($scope, $routeParams, $log){
  var subcate = $routeParams.subcatename;
  var subcategories = mm['subcategories'];
  	
	angular.forEach(subcategories, function(value, key){
		if(value['category_name']==subcate){
			$scope.subcategories = value['subcategories'];
			return;
		}
	});
});

/* 商家列表控制器 */
mm.controller('BusinessCtrl', function($scope, $routeParams, $http, $log){
  //init state
  $scope.display = true;
  $scope.isblank = false;

  var queryUrl = 'http://good-q.com/MW_CGI.cgi?flag=101&word=' + $routeParams.businesstype;
  $http.get(queryUrl).success(function(data){

      $scope.display = false;//hide the loading text

      if(!data.businesses){//no result fetched
        $scope.isblank = true;

        return;
      }

      $scope.businesses = data.businesses;

      mm['businesses'] = data.businesses;


    }).error(function(data){
      $log.log('data load error!');
    });
});


mm.controller('BaiduMapCtrl', function($scope, $routeParams, $http, $log){
  var bizid = $routeParams.business_id;
  var businesses = mm['businesses'];

  angular.forEach(businesses, function(value, key){
    if(value['business_id']==bizid){
      $scope.business = value;
      
      return;
    }
  }); 

});



