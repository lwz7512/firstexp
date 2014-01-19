'use strict';

var mm = angular.module('ngappApp');

var jsbridge;

//--------------------------------------
function remoteLog(msg, obj){
  setTimeout(function() {
    console.log(">>>>>> "+msg);
    console.log(obj);
  }, 1000);
}

window.onerror = function(err) {
  remoteLog('window.onerror: ', err);
}
  
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function() {
      callback(WebViewJavascriptBridge)
    }, false)
  }
}

//init jsbridge...
connectWebViewJavascriptBridge(function(bridge) {
    jsbridge = bridge;
    //remoteLog('oh, yeah: ', 'jsbridge inited!');
    jsbridge.init(function(message, responseCallback) {
      responseCallback(data);
    })
});

//--------------------------------------


/* 主页面控制器 */
mm.controller('MainCtrl', function ($scope, $http, $log, $window, $location) {

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
    //$location.path('/favorites');
    //$scope.$apply();
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
      mm['businesses'] = data.businesses;

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

  });//end of on dofavorite...

  //open new url in native webview
  $scope.enterShopPage = function(){
    var shopUrl = 'http://m.dianping.com/shop/' + businessId;
    if(typeof Android !== 'undefined') {//check android mobile environment
      Android.openURL(shopUrl);
    }

    //TODO, if iOS to open native webview...
    if(typeof iOS !== 'undefined'){

    }

  };//end of enterShopPage


});//end of BaiduMapCtrl


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
    if(jsbridge){
        //>>> call asynchronously method...
        jsbridge.callHandler('getFavorites', {'foo': 'bar'}, function(response) {
          remoteLog('JS got response', response);
          //TODO, asynic update the list...
          $scope.$evalAsync($scope.businesses = []);

          if($scope.businesses.length==0){//no result
            $scope.$evalAsync($scope.isblank = true);//runtime change the bound property
          }
        });
      }
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


