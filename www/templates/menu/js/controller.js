/**
 *      @author: kiran chakravarthi challagali
 *      @technical-support:
 *      email: kiran.challagali@providencesoft.com
 *      phone: +91 8886662322 
 *      
 *  @page-info:
 *      
 */

// this is the MenuController were the app's navigation takes place
rootController.controller('MenuController', function($ionicPlatform, $http, $window,$state, $rootScope, $scope, $timeout, $ionicHistory,$cordovaGeolocation,$ionicPopup,$interval,GeoAlert) {
    $scope.checkLogged = function() {
        $scope.isLogged = window.isLoggedG;
    };

	$interval( function() {

		$scope.checkLogged();
	}, 100);
    var users = window.globals.users;
    var locations = window.globals.locations;
    var checkinrecordid = window.globals.checkinrecordid;
    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 270000 };
    var address = globals.ServiceAddress;
    var popup;
    var address;
    var method;
    var parameter;
    var ServiceEndPoint;
    var latitude;
    var longitude;
    $rootScope.activeHome = true;
    $rootScope.activeLogin = false;
    $rootScope.activeMeeting = false;
    $rootScope.activeLogout = false;
    $rootScope.activeLeave = false;
    $rootScope.activeSettings = false;
    $rootScope.activeTravel = false;
    $rootScope.activeTrip = false;
    $rootScope.activeTimesheet = false;
    $rootScope.activecheckinout = false;
    $scope.check = window.Ischeckin;
    $scope.Ischeckout = window.Ischeckout;
    
    $scope.image = 'img/global/icon.png';
    
    if($scope.isLogged) {
        //$scope.image = 'img/global/user.png';
    }
    
    $scope.home = function() {
        
        $state.go('app.home', null, { reload: true });
        
        $rootScope.activeHome = true;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeLogout = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;
        
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };
    
    $scope.login = function() {
        
        $state.go('app.login', null, { reload: true });
        
        $rootScope.activeHome = false;
        $rootScope.activeLogin = true;
        $rootScope.activeMeeting = false;
        $rootScope.activeLogout = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;
        
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };
    
    $scope.meeting = function() {
        
        $state.go('app.meeting', null, { reload: true });
        
        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = true;
        $rootScope.activeLogout = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;
        
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    $scope.travel = function () {

        $state.go('app.travel', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeTravel = true;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;


        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    $scope.tracking = function () {

        $state.go('app.tracking', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeTravel = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTrip = true;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;


        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    $scope.leaves = function () {
        
        $state.go('app.leave', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = true;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;


        $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };

    $scope.settings = function () {
        
        $state.go('app.settings', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeSettings = true;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;
    };

    $scope.timesheet = function () {
        
        $state.go('app.timesheet', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = true;
        $rootScope.activecheckinout = false;
    };
        $scope.checkinout = function () {
        
        $state.go('app.checkinout', null, { reload: true });

        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = true;
         $ionicHistory.nextViewOptions({
            disableBack: true
        });
    };
    $scope.logout = function() {
        window.isLoggedG = false;
        
        $rootScope.activeHome = false;
        $rootScope.activeLogin = false;
        $rootScope.activeMeeting = false;
        $rootScope.activeSettings = false;
        $rootScope.activeLogout = false;
        $rootScope.activeLeave = false;
        $rootScope.activeTravel = false;
        $rootScope.activeTrip = false;
        $rootScope.activeTimesheet = false;
        $rootScope.activecheckinout = false;
        $rootScope.activeLogout = false;
        
        $timeout( function() {
            
           $state.go('app.login', null, { reload: true });

            window.isLoggedG = false;
        }, 600);

        $ionicHistory.clearCache().then(function () {
            //now you can clear history or goto another state if you need
            //$window.globals.clear();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

           
        })
    };


// *********************************************Check In Button***************************************************************************
$scope.checkIn_button = function()
{
   
for (var x = 0; x < locations.length; x++) {


                        var theDistance = getDistanceFromLatLonInKm(locations[x].latitude, locations[x].longitude, latitude, longitude);
                        //alert(theDistance);
                        if (theDistance <= 100) {
                            var found = true;
                            var loginUserslocation = window.globals.loginUserslocation;
                            loginUserslocation= locations[x];
                            window.globals.loginUserslocation = loginUserslocation;

                            InsertRecordforCheckIn(locations[x].title, locations[x].latitude, locations[x].longitude); //Inserting record

                            //GeoLocationServiceInterval(locations[x].title,locations[x].latitude, locations[x].longitude,"checkout");
                            break;
                        } 
                    }

                    if (!found) {
                        var popup = $ionicPopup.show({
                            title: 'System Error',
                            template: 'Not located in PSS branches',
                            buttons: [
                                {
                                    text: '<b>OK</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {

                                    }
                                },
                            ]
                        });

                        popup.then(function (res) {
                            //finally
                        });

                    }
                   
};
//********************************************get current location******************************************************************************
    function getCurrentLocations() {
        
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //console.log("lat:" + position.coords.latitude + "\n lng:" + position.coords.longitude);

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            //alert(latitude + " And " + longitude);
            //if (latitude === pss35.lat && longitude === pss35.lng) {
            //    //alert("PSS #35");
            //    isLoggedIn = true;
            //} else {
            //    //alert("Invaild location");
            //    isLoggedIn = false;
            //}

            //alert(distance(pss35.lat, pss35.lng, -26.165857, 28.240967100000034, "K"));
        }, function (error) {
 
            var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'Could not get location',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {

                                }
                            },
                        ]
                    });

                    popup.then(function (res) {
                        //finally
                    });


            //return;
        });


        
    }
//************************************* get Office locations from DB*************************************************************************************
    function getOfficeLocations(){

        //getting Pss office locations
        var address = globals.ServiceAddress;
        var method = globals.WebMethods.Addresslocations;
        var ServiceEndPoint = address + method;
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                locations = response.data.locations;
                window.globals.locations = locations;
               

            }

            else {
                //alert("System Error in locations api");

                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'System Error in locations api',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {

                                }
                            },
                        ]
                    });

                    popup.then(function (res) {
                        //finally
                    });
            }

        });
    }

    $scope.initializeView = function () {

            getCurrentLocations();
            getOfficeLocations();
            if(window.localStorage.getItem('Ischeckin'))
            {
            $scope.check= window.localStorage.getItem('Ischeckin');
            }
            else
            {
            $scope.check= window.Ischeckin;
            } 
            if(window.localStorage.getItem('Ischeckout'))
            {
            $scope.Ischeckout= false;
            }
            else
            {
            
            $scope.Ischeckout = window.Ischeckout;
            }   
       
        
    };

  // ***************************************Get Location Service Interval****************************************************************************

    // function GeoLocationServiceInterval(title,lat1,lon1,request){
    //     function onConfirm(idx) {
    //         //console.log('button ' + idx + ' pressed');
    //         if (idx == "Ok") {
    //             InsertRecordforCheckOut();
    //         }
    //         else {
    //             GeoLocationServiceInterval(lat1, lon1);
    //         }
    //     }

    //     if (request == "checkout") {
    //         //alert(lat1 + " And " + lon1 +" &&&& "+latitude + " And " + longitude);
    //         GeoAlert.begin(lat1, lon1, latitude, longitude, request, function () {
               
    //             //console.log('TARGET');
    //             GeoAlert.end();
    //             //navigator.notification.confirm(
    //             //  'You are going to out of office premesis!',
    //             //  onConfirm,
    //             //  'Out of Office!',
    //             //  ['Cancel', 'Ok']
    //             //);
    //             //alert("hai");
    //             InsertRecordforCheckOut();
    //             GeoLocationServiceInterval(title, lat1, lon1, "checkin");
    //         });
    //     }
    //     else {
    //         var found = false;
    //         //getCurrentLocations();
    //         for (var x = 0; x < locations.length-1; x++) {
    //             //alert(locations[x].latitude + " And " + locations[x].longitude);
    //             GeoAlert.begin(locations[x].latitude,locations[x].longitude, latitude, longitude, request, function () {
    //                 //alert("hai");
    //                 //console.log('TARGET');
    //                 GeoAlert.end();
    //                 found = true;
                    
    //                 //GeoLocationServiceInterval(title, lat1, lon1, "checkout");
                    
    //             });
    //             if (found) {
    //                 break;
                    
    //             }
    //         }

    //         InsertRecordforCheckIn(title, latitude, longitude);
    //     }
    // };
//***************************************Insert Record for Check In******************************************************************************
    function InsertRecordforCheckIn(title,latitude,longitude) {

        method = globals.WebMethods.loggedinRecord;
        parameter = "?userId=" + users.id + "&location=" + title + "&GPS=lat:" + latitude + " lon:" + longitude + "&reportto=" + users.reported_to;
        ServiceEndPoint = address + method + parameter;
console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null) {
                if (response.data.checkin !== "") {
                    
                   
                    
                    
                    window.localStorage.setItem('Ischeckin',true);
                    window.localStorage.setItem('Ischeckout',true);
                    window.globals.checkinrecordid = response.data.checkin;
                    popup = $ionicPopup.show({
                       title: 'PSS Global',
                       template: 'Succesfully checkedIn',
                       buttons: [
                           {
                               text: '<b>OK</b>',
                               type: 'button-positive',
                               onTap: function (e) {

                               }
                           },
                       ]
                    });

                    popup.then(function (res) {
                       //finally
                    });
                
                   // GeoLocationServiceInterval(title, latitude, longitude, "checkout");
                $state.go('app.checkinout', null, { reload: true });
                }

               
            }
            else {
               
                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'System Error in Insert checkin record api',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {

                                }
                            },
                        ]
                    });

                    popup.then(function (res) {
                        //finally
                    });
            }

        });
    }

    //*****************************Check out function****************************************************************************************** */
    $scope.checkout_button = function ()
    {
        InsertRecordforCheckOut();
    }
//*********************************Insert Record for Check Out****************************************************************************************
    function InsertRecordforCheckOut() {

        method = globals.WebMethods.logoutRecord;
        
        parameter = "?userId=" + users.id + "&recordId=" + window.globals.checkinrecordid;
        ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null) {

                if (response.data.checkout !== "") {
                   window.localStorage.removeItem('Ischeckin');
                   window.localStorage.removeItem('Ischeckout');
                    var popup = $ionicPopup.show({
                        title: 'PSS Global',
                        template: 'You have checked out',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {

                                }
                            },
                        ]
                    });

                    popup.then(function (res) {
                        //finally
                    });
                    $state.go('app.checkinout', null, { reload: true });
                }
            }
            else {

                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'System Error in Insert check out record api',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {

                                }
                            },
                        ]
                    });

                    popup.then(function (res) {
                        //finally
                    });
            }
        });
    }



});