'use strict';

angular.module('ngappApp')
  .directive('baidumap', function () {

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {      
            'ngModel': '='
        },
      link: function postLink($scope, element, attrs, controller) {
      	var containerId = element[0].id;

      	var ngModel = $scope.ngModel;
      	var markerName = ngModel['name'];
      	var address = ngModel['address'];
      	var telephone = ngModel['telephone'];
      	var longitude = ngModel['longitude'];
      	var latitude = ngModel['latitude'];

      	// 百度地图API功能
	    var map = new BMap.Map(containerId);
	    map.centerAndZoom(new BMap.Point(longitude, latitude), 14);
	    var marker1 = new BMap.Marker(new BMap.Point(longitude, latitude));  // 创建标注
	    map.addOverlay(marker1);              // 将标注添加到地图中

	    var content = "店名：<span>" + markerName + "</span><br/>";
	    content += "地址：<span>" + address + "</span><br/>";
	    content += "电话：<span>" + telephone + "</span><br/>";

	    //创建信息窗口
	    var infoWindow1 = new BMap.InfoWindow(content);
	    marker1.addEventListener("click", function(){this.openInfoWindow(infoWindow1);});
		
      }
    };
  });