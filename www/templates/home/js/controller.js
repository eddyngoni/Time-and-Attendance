/**
 *  @author: Koketso Gift Matlhatsi
 *  @technical-support:
 *      email: Koketso42@gmail.com
 *      phone: 071 530 2436 
 *      
 *  @page-info:
 *      
 */

// this is the MenuController were the app's navigation takes place
rootController.controller('HomeController', function($ionicPlatform,$http, $window, $state, $rootScope,$cordovaGeolocation,$scope, $ionicPopup ,$ionicHistory, $timeout, $interval,GeoAlert) {

    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };      
   /* $ionicPlatform.ready(function() {
        //$scope.$apply(function() {
            // sometimes binding does not work! :/
            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;
            
            alert("IMEI: " + device.uuid)
            
            var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
            deviceInfo.get(function(result) {
                    alert("result = " + result);
                    alert("Phone.No: " + JSON.parse(result).phoneNo);
                    alert("Phone.No: " + JSON.parse(result.account9Name)[0]);
                }, function() {
                    alert("error");
                }); 
        //});
    });
    
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
      requestReadPermission();
      window.plugins.sim.getSimInfo(successCallback, errorCallback);
    }

    function successCallback(result) {
      alert(JSON.stringify(result));
    }

    function errorCallback(error) {
      alert(error);
    }

    // Android only: check permission
    function hasReadPermission() {
      window.plugins.sim.hasReadPermission(successCallback, errorCallback);
    }

    // Android only: request permission
    function requestReadPermission() {
      window.plugins.sim.requestReadPermission(successCallback, errorCallback);
    } */


    $ionicHistory.nextViewOptions({
        disableBack: true
    });
});



rootController.controller('MapController1', function ($scope, $ionicPopup, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $state, $ionicHistory) {
    var lat = 0, long = 0;
    $ionicPlatform.ready(function () {




        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });



        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
           // alert(lat + " and " + long);
            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.map = map;
            $ionicLoading.hide();

        }, function (err) {
            $ionicLoading.hide();
            console.log(err);
        });
    });

   

   

    function distance(lat1, lon1, lat2, lon2) {
        var R = 1; // Earth's radius in Km
        return Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                        Math.cos(lon2 - lon1)) * R;
    }

    $scope.logout = function () {

        $ionicHistory.clearCache().then(function () {
            //now you can clear history or goto another state if you need
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

            $state.go('app.login');
        })
    };

});

