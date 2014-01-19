'use strict';

/*
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=7cbff608b2b4f329eaa7d3b7d557cd53"></script>
*/

angular.module('ngappApp')
  .directive('baidumap', function () {

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {      
            'ngModel': '='
        },
      link: function postLink($scope, element, attrs, controller) {
        
      	var ngModel = $scope.ngModel;
        if(!ngModel){
          console.error(">>> ngModel is undefined, to break!");
          return;
        }

      	var markerName = ngModel['name'];
      	var address = ngModel['address'];
      	var telephone = ngModel['telephone'];
      	var longitude = ngModel['longitude'];
      	var latitude = ngModel['latitude'];

      	// 百度地图API功能
  	    var map = new BMap.Map(element[0]);
  	    map.centerAndZoom(new BMap.Point(longitude, latitude), 18);
        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
  	    var marker1 = new BMap.Marker(new BMap.Point(longitude, latitude));  // 创建标注
  	    map.addOverlay(marker1);              // 将标注添加到地图中

  	    var content = "店名：<span>" + markerName + "</span><br/>";
  	    content += "地址：<span>" + address + "</span><br/>";
  	    content += "电话：<span>" + telephone + "</span><br/>";

  	    //创建信息窗口
  	    var infoWindow1 = new BMap.InfoWindow(content);
  	    marker1.addEventListener("click", function(){this.openInfoWindow(infoWindow1);});
		    marker1.openInfoWindow(infoWindow1);
      

      }
    };
  });
