'use strict';

angular.module('ngappApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/subcategories/:subcatename', {
        templateUrl: 'views/subcategory.html',
        controller: 'SubCategoryCtrl'
      })
      .when('/business/:businesstype', {
        templateUrl: 'views/businesses.html',
        controller: 'BusinessCtrl'
      })
      .when('/map/:business_id', {
        templateUrl: 'views/bizmap.html',
        controller: 'BaiduMapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
