/**
 *  @author: kiran chakravarthi challagali
 *  @technical-support:
 *  email: kiran.challagali@providencesoft.com
 *  phone: +91 8886662322 
 *      
 *  @page-info:
 *      
 */

// 
rootController.controller('LoginController', function ($ionicPlatform, $http, $window, $state, $rootScope, $scope, $ionicHistory, $timeout, $cordovaGeolocation, $interval, $cordovaFingerprint,$ionicLoading,$cordovaLocalNotification, $ionicPopup, GeoAlert) {
    
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };
    $scope.forgotPassword = function(){
     $state.go('app.restPassword', null, { reload: true });
       $ionicHistory.nextViewOptions({
            disableBack: true
        });
    }
    var users = window.globals.users;
    var locations = window.globals.locations;
    var checkinrecordid = window.globals.checkinrecordid;
    var popup;
    var address;
    var method;
    var parameter;
    var ServiceEndPoint;
    $scope.isActivated = false;
    $scope.isAvailable = false;
    $scope.data = {};

    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 270000 };

    var db = {
        alex: {
            lat: -26.101745,
            lng: 28.096884
        },
        pss35: {
            lat: -26.0874414,
            lng: 28.0829933
        },
        pss33: {
            lat: -26.081497,
            lng: 28.086436
        }
    };
    //Alex: -26.101745, 28.096884
    //PSS#35: -26.0874414, 28.0829933
    //PSS$33: -26.081497, 28.086436

    var pss35 = {
        lat: db.pss35.lat,
        lng: db.pss35.lng
    };

    var latitude;
    var longitude;
    var isLoggedIn = false;

    
    /**
     * Fingerprint authentication
     */
    $scope.isActivated = false;
    $scope.isAvailable = false;

    $ionicPlatform.ready(function() {
        //Is available
        $cordovaFingerprint.isAvailable().then(
          isAvailableSuccess, isAvailableError
        );

        function isAvailableSuccess(result) {

            $scope.isAvailable = true;

            if($window.localStorage['pss-fingerprint'] != null) {

                $scope.isActivated = true;
            } else {

                $scope.isActivated = false;
            }
        }

        function isAvailableError(message) {
          
             $scope.isAvailable = false;
        }
    });

    function showAuth(title, successCallback) {
        //Authenticate
        $cordovaFingerprint.show({
          clientId: title,
          clientSecret: "password"
        }).then(successCallback, errorCallback);

        function errorCallback(err) {
            //error occurred
            $ionicPopup.alert({
                title: 'System Warning',
                template: err
            }).then(function(res) {

            });
        }

    }

    $scope.showAuth = function() {

        if($scope.isAvailable) {

            if($window.localStorage['pss-fingerprint'] != null) {

                $scope.isActivated = true;

                showAuth("Biometrics", function(result) {

                    window.globals.SESSION.user = JSON.parse($window.localStorage['pss-fingerprint']);

                    var username = window.globals.SESSION.user.username;
                    var password = window.globals.SESSION.user.password;

                    $scope.login(username, password);
                });
            } else {

                $ionicPopup.alert({
                    title: 'System Warning',
                    template: "<h3>\
                                <b>Fingerprint</b> Authentication is deactivated, you can enable it by going to this app's\
                                <b>Settings</b> and enable\
                                <b>Fingerprint Authentication</b>.\
                                </h3>"
                }).then(function(res) {
                   
                });
                
                $scope.isActivated = false;
            }
        }
    };

     $scope.newtimeSheet = function(report_to){
        method = globals.WebMethods.newtimeSheet;
        var parameter = "?report_to=" + report_to;
        var listoftimesheet;
        ServiceEndPoint = address + method + parameter;
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {
                
                if (response.data.newtimeSt !== "") {
                    //employees = response.data.employees;
                    //$scope.managers = managers;
                    for(x=0;x<response.data.newtimeSt.length;x++){
                      console.log(response.data.newtimeSt[x].Id);
                        var now = new Date().getTime();
                        var _10SecondsFromNow = new Date(now + (1 * 1000+x));
                        $cordovaLocalNotification.schedule({
                        id: x,
                        title: 'TimeSheet',
                        text: response.data.newtimeSt[x].EmpName,
                        at: _10SecondsFromNow,
                        }).then(function (result) {
                        // ...
                    });
                    window.globals.employeetimesheet =  response.data.newtimeSt;
                    // listoftimesheet[x] = response.data.newtimeSt[x];
                    $rootScope.$on('$cordovaLocalNotification:click',
                    function (event, notification, state) {
                     //$scope.timesheetNotificationSetSideMenu();
                     $scope.timesheet();
                     $state.go('app.pushtimesheetDetails');
                    });
                    }

                }
            }
            else
                alert("System error in newtimeSheet API");
        });
    }


    $scope.login = function(username, password) {

        var found = false;

        address = globals.ServiceAddress;
        method = globals.WebMethods.Login;

        parameter = "?username=" + username + "&pwd=" + password;
        var ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
         $ionicLoading.show({
        template: 'Authenticating...'
        });
        
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.user_details !== "") {
                                      
                window.globals.SESSION.user = response.data.user_details;
                window.globals.SESSION.user.password = password;
                //alert(JSON.stringify(window.globals.SESSION.user));
                getOfficeLocations();
                users = response.data.user_details;
                window.globals.users = users;
                $ionicLoading.hide();
                //alert(window.globals.SESSION.user.user_role);
                //window.globals.UserSession.window.globals.UserSession.user = response.data.user_details;
               
                if (users.user_role === "1") {
                    window.globals.isAdmin = true;
                }
                else if (users.user_role === "2") {
                    $scope.newtimeSheet(username);
                    window.globals.isManager = true;
                }
                else {
                    window.globals.isAdmin = false;
                    window.globals.isManager = false;
                 }
                 if(users.department != null || users.department != undefined){
                 if(users.department.toUpperCase() === "HR")
                 {
                    window.globals.isHr = true;
                 }
                 else{
                     window.globals.isHr = false;
                 }
                 }
            window.isLoggedG = true;
            var popup = $ionicPopup.show({
            title: 'Confirmation',
            template: "<p>\
                        To continue, let your device turn on location using Google's location service.\
                        <br /> <br />\
                        <b>Your device will need to:</b>\
                        <br/><br/>\
                        <span class='icon ion-android-locate dark'></span> Use GPS, WiFi and cell networks\
                        <br/><br/>\
                        This may change the location mode you've selected for your device. For more details, go to:\
                        <br/>\
                        <b>Settings > Location</b>\
                    </p>",
            buttons: [
                {
                    text: '<span class="icon ion-checkmark"></span>',
                    type: 'button-positive',
                    onTap: function (e) {

                        $state.go('app.home', null, { reload: true });
                        $rootScope.activeHome = true;
                        
                        showToast("Welcome " + users.firstName + " " + users.lastName);
                        
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                    }
                }
            ]
        });
        popup.then(function (res) {
                                //finally
                            });

                    

                }
                else {
                   $ionicLoading.hide();
                    // if (!found) {
                    var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'Incorrect username or password',
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
            }
            else {

                //alert("System Error in login api");
                $ionicLoading.hide();
                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'Check internet connection',
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


    $scope.forgot = function () {

        
    };

    $ionicHistory.nextViewOptions({
        disableBack: true
    });
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

});
rootController.controller('restPasswordController',function($state,$http,$scope,$ionicLoading,$ionicHistory){
        
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };
        var address = globals.ServiceAddress;
        var method = globals.WebMethods.restPasswordLink;
        var ServiceEndPoint = address + method;
        $scope.issent=false;
        $scope.closeCard = function(){
        $scope.issent=false;
        $state.go('app.login', null, { reload: true });
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
             
        }
        $scope.submit = function(email){
                     $ionicLoading.show({
        template: 'please wait...'
        });
            var parameter = "?email=" + email;
            ServiceEndPoint = ServiceEndPoint +parameter;
            CallGetServive($http,ServiceEndPoint,function(response){
                if(response!=null){
                    if(response.data.sent == 'submitted'){
                        $scope.issent = true;
                        $ionicLoading.hide();                             
                    }else{
                        if(response.data.sent == ''){
                        $ionicLoading.hide();
                        $scope.issent = false;
                        showToast("Email is not registered with PSS Attendence app!");
                    }
                    else{
                        $ionicLoading.hide();
                        $scope.issent = false;
                        showToast("Email not sent try again");
                    }
                    }
                }
                else {

                //alert("System Error in login api");
                $ionicLoading.hide();
                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'Check internet connection',
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
            })
        }
});
rootController.controller('RegisterController', function ($state, $rootScope,$http ,$scope,$ionicPopup, $ionicHistory, $timeout, $cordovaGeolocation, $interval) {

    $scope.accept = function () {

       
        $state.go('app.home', null, { reload: true });
    };
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
                        template: 'check internet connection',
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


    

    $scope.disagree = function() {

        
    };

    $ionicHistory.nextViewOptions({
        disableBack: true
    });
});

rootController.controller('SettingsController', function($ionicPlatform, $window,$http, $state, $scope, $ionicHistory, $ionicPopup, $cordovaFingerprint, $ionicLoading) {
    
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };
    $scope.fingerprint = false;
    $scope.isAvailable = false;
    $scope.isStored = false;
    $scope.isOpen = false;
    $scope.new_pwd;
    $scope.isEmpty=false;
    $scope.islength=false;
    var address;
    var method;
    var new_password;
   // $scope.new_pwd;
    var user = window.globals.users;


    
    $scope.openSetPassword = function()
    {
        $scope.isOpen=true;

    }
    $scope.setPassword = function(new_pwd)
    {
        if(new_pwd!=null && new_pwd!=undefined)
        {
         if(new_pwd.length>=6)
         {
            $scope.islength = false;
            address = globals.ServiceAddress;
            method = globals.WebMethods.SetPassword;
            parameter = "?user_id=" + user.id + "&pwd="+new_pwd;
            var ServiceEndPoint = address + method + parameter;
            $ionicLoading.show({
            template: 'Please wait...'
            });
            
            CallGetServive($http, ServiceEndPoint, function (response) {
                if(response != null) {
                    $ionicLoading.hide();
                    showToast("password successfully changed");
                    $scope.isOpen=false;
                }
                else
                {
                    $ionicLoading.hide();
                    showToast("password did not change!");
                    $scope.isOpen=false;
                }
            });


         }
         else
         {
           $scope.islength = true;
         }
        }
        else
        {
            
            $scope.isEmpty=true;
        }
                                              
                

    }
    $scope.closeCard = function()
    {
        $scope.isOpen=false;
        $scope.isEmpty=false;
        $scope.islength = false;
    }
    if($window.localStorage['pss-fingerprint'] != null) {

        $scope.isStored = true;
        $scope.fingerprint = true;
    }

    $ionicPlatform.ready(function() {
        //Is available
        $cordovaFingerprint.isAvailable().then(
          isAvailableSuccess, isAvailableError
        );

        function isAvailableSuccess(result) {
          
            $scope.isAvailable = true;
        }

        function isAvailableError(message) {

            $scope.isAvailable = false;
        }
    });

    function showAuth(title, successCallback) {
        //Authenticate

        //cordovaAndroidFingerprintAuth
        $cordovaFingerprint.show({
          clientId: title,
          clientSecret: "password"
        }).then(successCallback, errorCallback);
        
        function errorCallback(err) {
            //error occurred
            $ionicPopup.alert({
                title: 'System Warning',
                template: err
            }).then(function(res) {

            });
        }
    }

    $scope.saveSettings = function(fingerprint) {

        if(fingerprint) {

            showAuth("Biometrics", function(result) {

                $window.localStorage['pss-fingerprint'] = angular.toJson(window.globals.SESSION.user);
                
                showLoading($ionicLoading, 'Please wait...');

                setTimeout( function() {      
                    
                    hideLoading($ionicLoading);
                    
                    showToast('Fingerprint Authentication is active');
                }, 600);
            });
        } else {

            showAuth("Disable Fingerprint Authentication", function(result) {

                $window.localStorage.removeItem('pss-fingerprint');
                
                showLoading($ionicLoading, 'Please wait...');

                setTimeout( function() {      
                    
                    hideLoading($ionicLoading);
                    
                    showToast('Fingerprint Authentication has been deactivated');
                }, 600);
            });
        }
    };


    
});