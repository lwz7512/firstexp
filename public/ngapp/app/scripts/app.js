'use strict';


var mainTemplate =  '<p id="loading" class="loading" ng-show="display">loading...</p>';
    mainTemplate +=   '<ul class="nav nav-list bs-docs-sidenav ">';
    mainTemplate +=     '<li ng-repeat="category in categories" selectedonmousedown>';
    mainTemplate +=       '<a href="#/subcategories/{{category.category_name}}" >';
    mainTemplate +=         '{{category.category_name}}';
    mainTemplate +=         '<span class="glyphicon glyphicon-chevron-right"></span>';
    mainTemplate +=       '</a>';
    mainTemplate +=     '</li>';
    mainTemplate +=   '</ul>';
    mainTemplate += '<div class="footer">';
    mainTemplate +=   '<p>♥ from the Runbytech team, QQ:626528719</p>';
    mainTemplate += '</div>';

var subCategoryTemplate =  '<ul class="nav nav-list bs-docs-sidenav">';
    subCategoryTemplate +=  '<li ng-repeat="category in subcategories" selectedonmousedown>';
    subCategoryTemplate +=    '<a href="#/business/{{category.category_name}}">';
    subCategoryTemplate +=      '{{category.category_name}}';
    subCategoryTemplate +=      '<span class="glyphicon glyphicon-chevron-right"></span>';
    subCategoryTemplate +=    '</a>';
    subCategoryTemplate +=  '</li>';
    subCategoryTemplate += '</ul>';
    subCategoryTemplate += '<div class="footer">';
    subCategoryTemplate +=  '<p>♥ from the Runbytech team, QQ:626528719</p>';
    subCategoryTemplate += '</div>';

var businessTemplate =  '<p id="loading" class="loading" ng-show="display">loading...</p>';
    businessTemplate += '<p id="blankresult" class="loading" ng-show="isblank">没有找到商家</p>';
    businessTemplate += '<ul class="nav nav-list bs-docs-sidenav">';
    businessTemplate +=   '<li selectedonmousedown ng-repeat="business in businesses" ng-click="itemClickHandler(business)">';
    businessTemplate +=     '<a href="#/map/{{business.business_id}}">';
    businessTemplate +=       '<img ng-src="{{business.s_photo_url}}" class="thumb">';
    businessTemplate +=       '<div class="label-grid">';
    businessTemplate +=         '<div class="top-row" >';
    businessTemplate +=           '<span class="item-title">{{business.name}}</span>';
    businessTemplate +=         '</div>';
    businessTemplate +=         '<div class="bottom-row">';
    businessTemplate +=           '<span>{{business.categories[0]}}</span>';
    businessTemplate +=           '<img ng-src="{{business.rating_s_img_url}}" class="bottom-right"></img>';
    businessTemplate +=         '</div>';
    businessTemplate +=       '</div>';
    businessTemplate +=       '<span class="glyphicon glyphicon-chevron-right arrow-offset"></span>';
    businessTemplate +=     '</a>';
    businessTemplate +=   '</li>';
    businessTemplate += '</ul>';
    businessTemplate += '<div class="footer">';
    businessTemplate +=   '<p>♥ from the Runbytech team, QQ:626528719</p>';
    businessTemplate += '</div>';

var mapTemplate =  '<div class="alert alert-success" style="text-align:center" ng-click="enterShopPage();">进入商户页</div>';
    mapTemplate += '<div id="mapcontainer" baidumap ng-model="business" class="baidu-map"></div>';
    mapTemplate += '<div class="footer">'; 
    mapTemplate +=    '<p>♥ from the Runbytech team, QQ:626528719</p>';
    mapTemplate += '</div>';

var favoritesTemplate =  '<p id="blankresult" class="loading" ng-show="isblank">没有收藏商家</p>';
    favoritesTemplate += '<ul class="nav nav-list bs-docs-sidenav">';
    favoritesTemplate +=    '<li selectedonmousedown ng-repeat="business in businesses" ng-click="itemClickHandler(business)">';
    favoritesTemplate +=      '<a href="#/map/{{business.business_id}}">';
    favoritesTemplate +=         '<img ng-src="{{business.s_photo_url}}" class="thumb">';
    favoritesTemplate +=         '<div class="label-grid">';
    favoritesTemplate +=            '<div class="top-row" >';
    favoritesTemplate +=              '<span class="item-title">{{business.name}}</span>';
    favoritesTemplate +=            '</div>';
    favoritesTemplate +=            '<div class="bottom-row">';
    favoritesTemplate +=              '<span>{{business.categories}}</span>';
    favoritesTemplate +=              '<img ng-src="{{business.rating_s_img_url}}" class="bottom-right"></img>';
    favoritesTemplate +=            '</div>';
    favoritesTemplate +=          '</div>';
    favoritesTemplate +=          '<span class="glyphicon glyphicon-chevron-right arrow-offset"></span>';
    favoritesTemplate +=       '</a>';
    favoritesTemplate +=    '</li>';
    favoritesTemplate += '</ul>';
    favoritesTemplate += '<div class="footer">';
    favoritesTemplate +=    '<p>♥ from the Runbytech team, QQ:626528719</p>';
    favoritesTemplate += '</div>';


angular.module('ngappApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate'
]).config(function ($routeProvider, $sceDelegateProvider) {

    $sceDelegateProvider
      .resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://m.dianping.com/shop/*']);

    $routeProvider
      .when('/', {
        //templateUrl: 'views/main.html',
        template: mainTemplate,
        controller: 'MainCtrl'
      })
      .when('/subcategories/:subcatename', {
        //templateUrl: 'views/subcategory.html',
        template: subCategoryTemplate,
        controller: 'SubCategoryCtrl'
      })
      .when('/business/:businesstype', {
        //templateUrl: 'views/businesses.html',
        template: businessTemplate,
        controller: 'BusinessCtrl'
      })
      .when('/map/:business_id', {
        //templateUrl: 'views/bizmap.html',
        template: mapTemplate,
        controller: 'BaiduMapCtrl'
      })
      .when('/favorites', {
        //templateUrl: 'views/favorites.html',
        template: favoritesTemplate,
        controller: 'FavoritesCtrl'
      })
      .when('/shop/:business_id', {
        template: '<div ng-include="templateUrl">正在打开...</div>', 
        controller: 'DynamicController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

/*
  highlight the ul>li while mouse down,  work in with css:

  .nav-list > li.active > a,
  .nav-list > li.active > a:hover,
  .nav-list > li.active > a:focus {
    color: #ffffff;
    background-color: #428bca;
  }

  usage:
  <ul class="nav nav-list bs-docs-sidenav ">
      <li ng-repeat="category in categories" selectedonmousedown>
          <a href="#">item...</a>
      </li>
  </ul>

*/
angular.module('ngappApp').directive('selectedonmousedown', function(){
  return {
    restrict: 'A',
    scope: {},
    link: function postLink($scope, element, attrs, controller) {

      element.mousedown(function(){
        element.addClass('active');
        //console.log("onmousedown...");
      });
    }
  };
});


