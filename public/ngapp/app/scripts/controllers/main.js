'use strict';

var mm = angular.module('ngappApp');

function remoteLog(msg, obj){
  setTimeout(function() {
    console.log(">>>>>> "+msg);
    console.log(obj);
  }, 1000);
}

function output(string) {
    var element = document.createElement("div")
    element.innerHTML = string
    outputElement.appendChild(element)
}


//TODO, move to a better place...rather than global style...
function dbQuery(db, where, limit, ondata) {
  db.select('favorites', '*', where, limit, function(r, q){// on success
    if(ondata) {
      var rows = [];
      var x; for(x=0; x<r.rows.length; x++) { rows.push(r.rows.item(x))};
      ondata(rows);
    }
  }, function(){//on error
    console.error("query error!");
  });
}

function dbInsert(db, item, ondata, onerror){
  db.insert('favorites', item, ondata, onerror);
}


/* 主页面控制器 */
mm.controller('MainCtrl', function ($scope, $http, $log, $window) {

  setTimeout(function(){// delay execuation for weinre: use console, rather than $log;
    //console.log("this can by outputed debug info to weinre...");
  }, 1000);

  //$log("does $log can by output to weinre?");//no!
  //console.log("does console can by output to weinre?");//yes!

  //init state
  $scope.display = true;

  $http.get('/json/classify.json').success(function(data){

    $scope.display = false;//hide the loading text
  	$scope.categories = data.categories;
    mm['subcategories'] = data.categories;//save the categories for next page use

  }).error(function(data){
  	$log.log('data load error!');
  });

  //listening index.html broadcast event...
  $scope.$on('gofavorites', function(event, args){
    $window.location.href = args;
  });

});


/* 子分类控制器 */
mm.controller('SubCategoryCtrl', function($scope, $routeParams, $log, $window){

  var subcate = $routeParams.subcatename;
  var subcategories = mm['subcategories'];
  	
	angular.forEach(subcategories, function(value, key){
		if(value['category_name']==subcate){
			$scope.subcategories = value['subcategories'];
			return;
		}
	});

  //listening index.html broadcast event...
  $scope.$on('gofavorites', function(event, args){
    $window.location.href = args;
  });

});


/* 商家列表控制器 */
mm.controller('BusinessCtrl', function($scope, $routeParams, $http, $log, $window){

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
      //mm['businesses'] = data.businesses;

    }).error(function(data){
      $log.log('data load error!');
    });


  $scope.itemClickHandler = function(business){
    mm['business'] = business;//save for map use...
    //$log.log(business);
  };

  //listening index.html broadcast event...
  $scope.$on('gofavorites', function(event, args){
    $window.location.href = args;
  });

});


/*百度地图控制器*/
mm.controller('BaiduMapCtrl', function($scope, $routeParams, $http, $log){

  $scope.business = mm['business'];

  var businessId = mm['business']['business_id'];

  var rowcount = 0;
  
  $scope.$on('dofavorite', function(event, args){//listening the index broacast event

    //add the missed create_time field
    var now = Math.floor(new Date().getTime()/1000);//in second
    mm['business']['create_time'] = now;
    
    var jsonBusiness = JSON.stringify(mm['business']);
    remoteLog("save: ", jsonBusiness);

    if(typeof Android !== 'undefined') {//check android mobile environment
      Android.saveFavorite(jsonBusiness);
    }

  });

  //open new url in native webview
  $scope.enterShopPage = function(){
    var shopUrl = 'http://m.dianping.com/shop/' + businessId;
    if(typeof Android !== 'undefined') {//check android mobile environment
      Android.openURL(shopUrl);
    }

    //TODO, if iOS
    if(typeof iOS !== 'undefined'){

    }

  };

});


/*收藏列表控制器*/
mm.controller('FavoritesCtrl', function($scope, $routeParams, $http, $log){

  $scope.isblank = false;//hide the blank favorites hint text

  if(typeof Android !== 'undefined'){//check android mobile environment

    var favorites = Android.getFavorites();//get data from native
    remoteLog("saved: ", favorites);

    $scope.businesses = JSON.parse(favorites);//set for view render

    if($scope.businesses.length==0){//no result
      $scope.$evalAsync($scope.isblank = true);//runtime change the bound property
    }

  }else if(typeof iOS !== 'undefined'){//check ios mobile environment

  }else{
    remoteLog(">>>", "current in browser environment...");
  }

  $scope.itemClickHandler = function(business){
    mm['business'] = business;//save for map use...
    $log.log(business);
  }
  
});


/*商户页面控制器*/
/*暂时没法使用，涉及到跨站请求。。。*/
/*2014//01/15*/
mm.controller('DynamicController', function($scope, $routeParams, $sce){
  var shopUrl = 'http://m.dianping.com/shop/' + $routeParams.business_id;
  $scope.templateUrl = shopUrl;
});


