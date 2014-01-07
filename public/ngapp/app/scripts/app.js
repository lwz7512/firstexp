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
        console.log("onmousedown...");
      });
    }
  };
});


