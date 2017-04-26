/**
 *  @author: Kiran Chakravarthi Ch
 *  @technical-support:
 *      email: Kiran.challagali@providencesoft.com
 *      phone: +91 8886662322
 *      
 *  @page-info:
 *      
 */



rootController.controller('ChangeOfficeController', function ($ionicPlatform, $http, $state, $rootScope, $scope, $ionicHistory, $timeout, $cordovaGeolocation, $interval, $cordovaFingerprint, GeoAlert) {
   
   
    $scope.offices = [{
        id: '1',
        name: 'Pss32'
    }, {
        id: '2',
        name: 'Pss33'
    }, {
        id: '3',
        name: 'Pss34'
    }, {
        id: '4',
        name: 'Pss35'
    }, {
        id: '5',
        name: 'PssIndia'
    }, {
        id: '6',
        name: 'Others'
    }];

        
    $scope.changedValue = function (item) {
       
        if (item.name == "Others") {
         
            document.getElementById("lblotherOffice").style.display = "block";
        }
        else{
        document.getElementById("lblotherOffice").style.display = "none";
    }

    };

   

});

