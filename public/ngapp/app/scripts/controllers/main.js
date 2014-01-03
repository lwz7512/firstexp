'use strict';

var mm = angular.module('ngappApp');

mm.controller('MainCtrl', function ($scope, $http, $log) {
    $http.get('/json/classify.json').success(function(data){

      $scope.display = false;//hide the loading text
    	$scope.categories = data.categories;

    	//save the categories
    	mm['subcategories'] = data.categories;

    }).error(function(data){
    	$log.log('data load error!');
    });
});


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


mm.controller('BusinessCtrl', function($scope, $routeParams, $http, $log){
  $http.get('/json/business_bj_cy_sport_0.json').success(function(data){
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



