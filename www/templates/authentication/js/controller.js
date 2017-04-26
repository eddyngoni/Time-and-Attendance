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
rootController.controller('LoginController', function ($ionicPlatform, $http, $window, $state, $rootScope, $scope, $ionicHistory, $timeout, $cordovaGeolocation, $interval, $cordovaFingerprint, $ionicPopup, GeoAlert) {
    
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };

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
                    template: `<b>Fingerprint</b> Authentication is deactivated, you can enable it by going to this app's <b>Settings</b> and enable <b>Fingerprint Authentication</b>.`
                }).then(function(res) {
                   
                });
                
                $scope.isActivated = false;
            }
        }
    };

    $scope.login = function(username, password) {

        var found = false;

        address = globals.ServiceAddress;
        method = globals.WebMethods.Login;

        parameter = "?username=" + username + "&pwd=" + password;
        var ServiceEndPoint = address + method + parameter;
        
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.user_details !== "") {
                                      
                window.globals.SESSION.user = response.data.user_details;
                window.globals.SESSION.user.password = password;

                //alert(JSON.stringify(window.globals.SESSION.user));

                users = response.data.user_details;
                window.globals.users = users;

                //alert(window.globals.SESSION.user.user_role);
                //window.globals.UserSession.window.globals.UserSession.user = response.data.user_details;

                if (users.user_role === "1") {
                window.globals.isAdmin = true;
                }
                else if (users.user_role === "2") {
                window.globals.isManager = true;
                }
                else {
                window.globals.isAdmin = false;
                window.globals.isManager = false;
                 }
            window.isLoggedG = true;
            var popup = $ionicPopup.show({
            title: 'Confirmation',
            template: `<p>To continue, let your device turn on location using Google's location service.
                        <br /> <br />
                        <b>Your device will need to:</b>
                        <br/><br/>
                        <span class="icon ion-android-locate dark"></span> Use GPS, WiFi and cell networks
                        <br/><br/>
                        This may change the location mode you've selected for your device. For more details, go to:
                        <br/>
                        <b>Settings > Location</b></p>
            `,
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
                },
                { text: '<span class="icon ion-close positive"></span>' }
            ]
        });
        popup.then(function (res) {
                                //finally
                            });

                    

                }
                else {

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
                var popup = $ionicPopup.show({
                        title: 'System Error',
                        template: 'System Error in login api',
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
});

rootController.controller('RegisterController', function ($state, $rootScope, $scope, $ionicHistory, $timeout, $cordovaGeolocation, $interval) {

    $scope.accept = function () {

        $state.go('app.home', null, { reload: true });
    };

    $scope.disagree = function() {

        
    };

    $ionicHistory.nextViewOptions({
        disableBack: true
    });
});

rootController.controller('SettingsController', function($ionicPlatform, $window, $state, $scope, $ionicHistory, $ionicPopup, $cordovaFingerprint, $ionicLoading) {
    
    $scope.fingerprint = false;
    $scope.isAvailable = false;
    $scope.isStored = false;

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