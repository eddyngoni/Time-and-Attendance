/**
 *  @author: kiran chakravarthi challagali
 *  @technical-support:
 *  email: kiran.challagali@providencesoft.com
 *  phone: +91 8886662322 
 *      
 *  @page-info:
 *  
 *      This is were we place our app configurations, import all the app plugins in this page and include the necessary settings/configuration for this app.
 */ 

var db = null;
window.isLoggedG = false;
window.Ischeckin = false;
window.Ischeckout = true;
window.globals = {

    ServiceAddress: "http://providencesoftware.co.za/mobileApi/",
 

    WebMethods: {
        ContactUs: "contactUs",
        AboutUs: "aboutUs",
        Login: "login",      
        Addresslocations: "locations",
        loggedinRecord: "checkin",
        logoutRecord: "checkout",
        manager: "managers",
        businesstrip: "BusinessTrip",
        getbusinesstrips: "GetBusinessTrips",
        updatebusinesstripstatus: "UpdateBusinessTripStatus",
        submitleave: "LeaveApplication",
        getleaverequests: "GetLeaveRequests",
        updateleaverequest:"UpdateLeaveRequest",
        gettimesheets: "GetTimesheets",
        submittimesheet: "TimesheetApplication",
        getallemployees: "GetAllEmployees",
        ApproveTimeSheet_func:"ApproveTimeSheet_func"

    },

    UserSession: {
        user: {},
        isAuthenticated: false
    },

    SESSION: {
        user: null,
        userLeaveRequestsList: [],
        userClaimsList: []
    },

    users: {              //for login user data

    },

    employees: {              //for all employees

    },
    employeetimesheet: {              //for all employee timesheet

    },

    locations: {           // for storing all pss office locations


    },

    managers:{ },

    loginUserslocation:{}, 

    claimsList: [],              //for BusinessTips
    LeaverequestsList: [],      // for LeaveRequests
    isAdmin:false,
    fingerprint: false,
    isManager: false,
    isLogout: false,
    checkinrecordid: 0
};

//declare the root app 
// this is the initial code that gets executed first whenever we execute this app.
var app = angular.module('pss', ['ionic', 'ion-floating-menu', 'ngCordova', 'ngCordova.plugins.device', 'pss.controllers', 'pss.services', 'ngMessages']);

app.run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }


    });

    //disable ionic transition
    $rootScope.$watch(function () {
        return $("ion-side-menu-content").css("transform");
    }, function (css) {
        if (css == "matrix(1, 0, 0, 1, -275, 0)") {
            $("ion-side-menu-content").css("transform", "translate3d(0px 0px 0px)");
            $("ion-side-menu-content").css("-webkit-transform", "translate3d(0px 0px 0px)");
            $("ion-side-menu-content").css("-ms-transform", "translate3d(0px 0px 0px)");
        }
    });
});

app.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

app.config(function ($stateProvider, $urlRouterProvider) {

    var provider = $stateProvider;

    provider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu/html/menu.html',
        controller: 'MenuController'
    });

    provider.state('app.home', {
        url: '/home',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/home/html/home.html',
                controller: 'HomeController'
            }
        }
    });

    provider.state('app.login', {
        url: '/login',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/authentication/html/login.html',
                controller: 'LoginController'
            }
        }
    });

    provider.state('app.register', {
        url: '/register',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/authentication/html/register.html',
                controller: 'RegisterController'
            }
        }
    });

    provider.state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/authentication/html/settings.html',
                controller: 'SettingsController'
            }
        }
    });

    provider.state('app.meeting', {
        url: '/meeting',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/attendance/html/meeting.html',
                controller: 'MeetingController'
            }
        }
    });

    provider.state('app.adminMeeting', {
        url: '/adminMeeting',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/attendance/html/admin.html',
                controller: 'MeetingController'
            }
        }
    });

    provider.state('app.tracking', {
        url: '/tracking',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/travel/html/tracking.html',
                controller: 'TrackingController'
            }
        },
        
    });

    provider.state('app.map', {
        url: '/map/:context',
        views: {
            'menuContent': {
                templateUrl: 'templates/travel/html/map.html',
                controller: 'MapController',
                data: {
                    'context': null
                }
            }
        }
    });

    provider.state('app.travelDetails', {
        url: '/travelDetails/:context',
        views: {
            'menuContent': {
                templateUrl: 'templates/travel/html/details.html',
                controller: 'TravelDetailsController',
                data: {
                    'context': null
                }
            }
        }
    });

    provider.state('app.leave', {
        url: '/leave',
        views: {
            'menuContent': {
                templateUrl: 'templates/leave/html/leave.html',
                controller: 'LeaveController'
            }
        }
    });

    provider.state('app.leaveDetails', {
        url: '/leaveDetails/:context',
        views: {
            'menuContent': {
                templateUrl: 'templates/leave/html/details.html',
                controller: 'LeaveDetailsController',
                data: {
                    'context': null
                }
            }
        }
    });

    provider.state('app.travel', {
        url: '/travel',
        views: {
            'menuContent': {
                templateUrl: 'templates/travel/html/travel.html',
                controller: 'TravelController'
            }
        }
    });

    provider.state('app.timesheet', {
        url: '/timesheet',
        views: {
            'menuContent': {
                templateUrl: 'templates/timesheet/html/timesheet.html',
                controller: 'TimesheetController'
            }
        }
    });
        provider.state('app.checkinout', {
        url: '/menu',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu/html/checkInOut.html',
                controller: 'MenuController'
            }
        }
    });
        provider.state('app.timesheetview', {
        url: '/timesheet/:context',
        views: {
            'menuContent': {
                templateUrl: 'templates/timesheet/html/viewtimesheet.html',
                controller: 'timesheetDetailsController',
                data: {
                    'context': null
                }
            }
        }
    });

    provider.state('app.timesheetDetails', {
        url: '/timesheetDetails/:context',
        views: {
            'menuContent': {
                templateUrl: 'templates/timesheet/html/details.html',
                controller: 'timesheetDetailsController',
                data: {
                    'context': null
                }
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/register');
});

app.directive('menuToggle', function ($state, $ionicHistory) {
    return {
        link: function ($scope, $element, $attrs) {
            $element.bind('click', function () {

                openNav();

            });
        }
    };
});

app.directive('menuClose', function ($state, $ionicHistory) {
    return {
        link: function ($scope, $element, $attrs) {
            $element.bind('click', function () {

                closeNav();

            });
        }
    };
});

app.factory("DistanceMetrix", function($http) {

    return {

        getDistanceMetrixBetweenLocations: function(depature, destination) {

            var ServiceEndPoint = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + depature  + "&destinations=" + destination;

            return $http({
                method: 'GET',
                cache: false,
                headers: {
                    'Cache-Control' : 'no-cache',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: ServiceEndPoint
            });
        }
    };
});