/**
 *  @author: kiran chakravarthi challagali
 *  @technical-support:
 *      email: kiran.challagali@providencesoft.com
 *      phone: +91 8886662322 
 *      
 *  @page-info:
 *  
 *      
 */
// rootController.directive('ngautocomplete' ,function () {
//     console.log('loc')
//       var map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -33.8688, lng: 151.2195},
//           zoom: 13
//         });
//         var input = document.getElementById('autocomplete');

//         map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

//         var autocomplete = new google.maps.places.Autocomplete(input);

//         // Bind the map's bounds (viewport) property to the autocomplete object,
//         // so that the autocomplete requests use the current map bounds for the
//         // bounds option in the request.
//         autocomplete.bindTo('bounds', map);

    

//         autocomplete.addListener('place_changed', function() {
//           var place = autocomplete.getPlace();
//           if (!place.geometry) {
//             // User entered the name of a Place that was not suggested and
//             // pressed the Enter key, or the Place Details request failed.
//             window.alert("No details available for input: '" + place.name + "'");
//             return;
//           }
//           var address = '';
//           if (place.address_components) {
//             address = [
//               (place.address_components[0] && place.address_components[0].short_name || ''),
//               (place.address_components[1] && place.address_components[1].short_name || ''),
//               (place.address_components[2] && place.address_components[2].short_name || '')
//             ].join(' ');
//           }
//         });

//         // Sets a listener on a radio button to change the filter type on Places
//         // Autocomplete.
//       }        
        
        
        
        
// )
'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Simple Usage:
 *
 * <input type="text" ng-autocomplete="result"/>
 *
 * creates the autocomplete text box and gives you access to the result
 *
 *   + `ng-autocomplete="result"`: specifies the directive, $scope.result will hold the textbox result
 *
 *
 * Advanced Usage:
 *
 * <input type="text" ng-autocomplete="result" details="details" options="options"/>
 *
 *   + `ng-autocomplete="result"`: specifies the directive, $scope.result will hold the textbox autocomplete result
 *
 *   + `details="details"`: $scope.details will hold the autocomplete's more detailed result; latlng. address components, etc.
 *
 *   + `options="options"`: options provided by the user that filter the autocomplete results
 *
 *      + options = {
 *           types: type,        string, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *           bounds: bounds,     google maps LatLngBounds Object
 *           country: country    string, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *         }
 *
 *
 */
$(document).on({
    'DOMNodeInserted': function () {
     setTimeout(function() {
        document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true');
      });
    }
}, '.pac-container');

$(document).on('click', '.pac-item', function () {
    $(".pac-item").removeClass('pac-item-selected');
    $(this).addClass('pac-item-selected');

    var query_part = $(this).children('.pac-item-query').map(function () {
        return $(this).text();
    }).get().join(" ");

    var results_part = $(this).last().map(function () {
        return $(this).text();
    }).get().join(", ");

    var retval = query_part + " " + results_part.replace(query_part, "");
    setTimeout(function () {
        $('#Autocomplete').val(retval);
        $('.pac-container').css({'display' : 'none'});
    }, 50);
});


rootController.directive('ngAutocomplete', function() {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?'
      },

      link: function(scope, element, attrs, controller) {

        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function() {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        if (scope.gPlace == undefined) {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
        }
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function() {

                scope.details = result;

                controller.$setViewValue(element.val());
              });
            }
            else {
              if (watchEnter) {
                getPlace(result)
              }
            }
          }
        })

        //function to get retrieve the autocompletes first result using the AutocompleteService
        var getPlace = function(result) {
          var autocompleteService = new google.maps.places.AutocompleteService();
          if (result.name.length > 0){
            autocompleteService.getPlacePredictions(
              {
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list, status) {
                if(list == null || list.length == 0) {

                  scope.$apply(function() {
                    scope.details = null;
                  });

                } else {
                  var placesService = new google.maps.places.PlacesService(element[0]);
                  placesService.getDetails(
                    {'reference': list[0].reference},
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                        scope.$apply(function() {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = detailsResult;

                          //on focusout the value reverts, need to set it again.
                          var watchFocusOut = element.on('focusout', function(event) {
                            element.val(detailsResult.formatted_address);
                            element.unbind('focusout')
                          })

                        });
                      }
                    }
                  );
                }
              });
          }
        }

        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
        }, true);

      }
    };
  });


rootController.controller('TrackingController', function ($state, $scope, $ionicHistory) {
   
    $scope.onDragLeft = function () {
        closeNav();
    };

    $scope.onDragRight = function () {
        openNav();
    };

    $scope.isBusiness = true;

    $scope.business = function () {

        $scope.isBusiness = true;
    };

    //$scope.personal = function () {

    //    $scope.isBusiness = true;
    //};

    $scope.submit = function (object) {
        $state.go('app.map', { 'context': object });
    };

    $scope.customSubmit = function (object) {
        $state.go('app.map', { 'context': object });
    };
});

rootController.controller('TravelController', function ($http,$state, $scope,$ionicPopup, $ionicHistory,$ionicLoading,$cordovaGeolocation) {
   
    $scope.onDragLeft = function () {
        closeNav();
    };

    $scope.onDragRight = function () {
        openNav();
    };
    $scope.from;
    $scope.isHr = window.globals.isHr;
    window.globals.SESSION.userClaimsList = [];

    var userRequestsList = window.globals.SESSION.userClaimsList;
   
    var address = globals.ServiceAddress;
    var method = globals.WebMethods.getbusinesstrips;
    var managers = window.globals.managers;
    var users = window.globals.users;
    $scope.offices = window.globals.locations;
    $scope.report_to = window.globals.SESSION.user.reported_to;
    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 270000 };
    console.log(window.globals.locations);
    if (jQuery.isEmptyObject(managers)) { //checking managers varialbe 
        
        address = globals.ServiceAddress;
        method = globals.WebMethods.manager;

        var ServiceEndPoint = address + method;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.managers !== "") {
                    managers = response.data.managers;
                    for (var i = 0; i < managers.length; i++) {
                        //alert(users.username);
                        if (managers[i].username.toUpperCase() == users.username.toUpperCase()) {
                            managers.splice(i, 1);
                        }
                    }
                    $scope.managers = managers;
                    window.globals.managers = managers;
                }
            }
         else {
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

    
    
    $scope.managers = managers;
    method = globals.WebMethods.getbusinesstrips;
    var ServiceEndPoint = address + method;
    console.log(ServiceEndPoint);
    var userEmpRequestsList = [];
    $scope.isManager = window.globals.isManager;
    $scope.isAdmin = window.globals.isAdmin;
    CallGetServive($http, ServiceEndPoint, function (response) {
        if (response != null) {

            if (response.data.businesstrips !== "") {
                //managers = response.data.managers;
                window.globals.claimsList = response.data.businesstrips;



                //alert(window.globals.claimsList.length);
                for (var x = 0; x < window.globals.claimsList.length; x++) {

                    if (window.globals.claimsList[x].userId === window.globals.SESSION.user.id) {
                        //alert("hai");
                        userRequestsList.push(window.globals.claimsList[x]);
                    }
                }

                $scope.requestsList = userRequestsList;
                
                
                
                for (var x = 0; x < window.globals.claimsList.length; x++) {
                    
                    if ($scope.isAdmin) {
                        if (window.globals.claimsList[x].id !== window.globals.SESSION.user.id) {
                            userEmpRequestsList.push(window.globals.claimsList[x]);
                        }
                    }
                    else if ($scope.isManager) {
                        if($scope.isHr){
                        if (window.globals.claimsList[x].status =='Approved') {
                            userEmpRequestsList.push(window.globals.claimsList[x]);
                        }
                    }
                    else{
                         if (window.globals.claimsList[x].id !== window.globals.SESSION.user.id && window.globals.claimsList[x].approver == window.globals.SESSION.user.username) {
                            userEmpRequestsList.push(window.globals.claimsList[x]);
                        }
                    }
                    }
                }

                $scope.empRequestsList = userEmpRequestsList;

                if ($scope.isManager)
                    $scope.isRequest = $scope.isManager;
                else if ($scope.isAdmin){
                    $scope.isRequest = $scope.isAdmin;
                    $scope.isManager = $scope.isAdmin;
                }
                else
                    $scope.isRequest = $scope.isManager;

                $scope.isTrip = false;
                $scope.isCustom = false;

                if (!$scope.isManager && !$scope.isAdmin) {
                    
                    $scope.isTrip = true;
                }

                
            }

        }
         else {
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

    //$scope.empRequestsList = userEmpRequestsList;
    
    $scope.isRequest = $scope.isManager;
    $scope.isTrip = false;
    $scope.isCustom = false;
    $scope.isApproved = false;
    if (!$scope.isManager) {
        $scope.isTrip = true;
    }

    $scope.request = function () {

        $scope.isRequest = true;
        $scope.isTrip = false;
        $scope.isCustom = false;
        $scope.isApproved = false;
       
    };
$scope.requestApprove = function(){

        $scope.isRequest = false;
        $scope.isTrip = false;
        $scope.isCustom = false;
        $scope.isApproved = true;
};

    $scope.myTrips = function () {

        $scope.isRequest = false;
        $scope.isTrip = true;
        $scope.isCustom = false;
        $scope.isApproved = false;
    };

    $scope.customTrip = function () {

        $scope.isRequest = false;
        $scope.isTrip = false;
        $scope.isCustom = true;
        $scope.getCurrentLocations();
    };

    $scope.travelDetails = function (request) {

        $state.go('app.travelDetails', { 'context': angular.toJson(request) });
        //$state.go('app.leaveDetails', { 'context': JSON.stringify(request) });
    };
//********************************* Address from ****************************************************************** */
    function getAddressFromLatLang(lat,lng) {

        //console.log("Entering getAddressFromLatLang()");

        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(lat, lng);

        geocoder.geocode( { 'latLng': latLng}, function(results, status) {

            //console.log("After getting address");
            //console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                   // console.log(results[1]);
                    
                    $scope.from = results[1].formatted_address;
                }
            }else{
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
       
       // console.log("Entering getAddressFromLatLang()");
    }
     $scope.getDistanceMetrixBetweenLocations = function(depature, destination){

        var results = null;

        var ServiceEndPoint = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + depature  + "&destinations=" + destination;

        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null) {
                if(response.data != "")
                  results = response.data; // returns distanceMatrix Object "includes array[destination_addresses], string: origin_addresses, object(distance), object(duration)"
            }
             else {
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

        return results;
    }

//********************************************get current location******************************************************************************
     $scope.getCurrentLocations = function() {
        
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            getAddressFromLatLang(position.coords.latitude,position.coords.longitude);
            
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


    $scope.logTrip = function (reason, office, from, to, date, time, timeArrived, distance, approver) {
      
        function toMonth(theDate) {

            switch (theDate) {

                case 1:
                    return "Jan"
                case 2:
                    return "Feb"
                case 3:
                    return "Mar"
                case 4:
                    return "Apr"
                case 5:
                    return "May"
                case 6:
                    return "Jun"
                case 7:
                    return "Jul"
                case 8:
                    return "Aug"
                case 9:
                    return "Sep"
                case 10:
                    return "Oct"
                case 11:
                    return "Nov"
                default:
                    return "Dec"
            }
        }
        //alert("hai");
        var start = new Date(date);
        var theDate = (start.getUTCDate() + 1) + " " + toMonth(start.getMonth() + 1) + " " + start.getFullYear();

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function formatTime(theTime) {

            var d = new Date(theTime);

            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());
            var s = addZero(d.getSeconds());

            return h + ":" + m;
        }

        var depature = office;
        if(office === null || office === "") {

            depature = from
        }
        var requestObj;
        
        if (office == "Other")
            depature = from;
        else
            depature = office;
       
        if (window.globals.LeaverequestsList.length > 0) {
            requestObj = {
                id: Number(window.globals.claimsList[window.globals.claimsList.length - 1].id) + 1,
                name: window.globals.SESSION.user.username,
                reason: reason,
                slocation: depature,
                dlocation: to,
                created_on: date,
                start_time: formatTime(),
                end_time: formatTime(timeArrived),
                distance: distance + " km",
                approver: approver,
                status: 'In Progress'
            };
        }
        else {
            requestObj = {
                id: 1,
                name: window.globals.SESSION.user.username,
                reason: reason,
                slocation: depature,
                dlocation: to,
                created_on: date,
                start_time: formatTime(time),
                end_time: formatTime(timeArrived),
                distance: distance + " km",
                approver: approver,
                status: 'In Progress'
            };
        }

        

        var method = globals.WebMethods.businesstrip;
        //var users = window.globals.users;
       
        var parameter = "?userId=" + users.id + "&name=" + users.firstName + " " + users.lastName + "&slocation=" + depature + "&dlocation=" + to + "&stime=" + formatTime(time) + "&dtime=" + formatTime(timeArrived) + "&distance=" + distance + " km" + "&reason=" + reason + "&approver=" + approver + "&status=In Progress";
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        var ServiceEndPoint = address + method + parameter;
          $ionicLoading.show({
        template: 'please wait...'
        });
        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null) {

                if (response.data.BusinessTrip == "") {
                    alert("Not submitted");
                }
                else {

                    window.globals.claimsList.push(requestObj);
                    window.globals.SESSION.userClaimsList.push(requestObj);
                    $ionicLoading.hide();
                    showToast("Your Travel Claim has been processed.");
                    
                }

            }
            else {
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
       $ionicLoading.hide();
       
    };
});

rootController.controller('TravelDetailsController', function ($http,$state, $stateParams,$ionicPopup, $scope, $ionicHistory) {

    $scope.requestObj = JSON.parse($stateParams.context);

    var requestsList = window.globals.claimsList;

    var address = globals.ServiceAddress;
    var method = globals.WebMethods.updatebusinesstripstatus;
    var parameters;

    $scope.approve = function (request) {

        for (var x = 0; x < requestsList.length; x++) {

            

            if (requestsList[x].id == request.id) {

                
                parameters = "?Id=" + request.id + "&Status=Approved";
                var ServiceEndPoint = address + method+parameters;
                console.log(ServiceEndPoint);
                CallGetServive($http, ServiceEndPoint, function (response) {
                    if (response != null) {

                        if (response.data.UpdateBusinessTripStatus !== "") {

                            requestsList[x].status = "Approved";
                            $scope.requestObj = requestsList[x];

                            window.globals.claimsList = [];
                            window.globals.claimsList = requestsList;
                           

                        }
                    }
                else {
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

                break;
            }
        }
    };

    $scope.reject = function (request) {

        for (var x = 0; x < requestsList.length; x++) {

            if (requestsList[x].id == request.id) {

                parameters = "?Id=" + request.id + "&Status=Declined";
                var ServiceEndPoint = address + method + parameters;
                console.log(ServiceEndPoint);
                CallGetServive($http, ServiceEndPoint, function (response) {
                    if (response != null) {

                        if (response.data.UpdateBusinessTripStatus !== "") {

                            requestsList[x].status = "Declined";
                            $scope.requestObj = requestsList[x];

                            window.globals.claimsList = [];
                            window.globals.claimsList = requestsList;


                        }
                    }
                else {
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
                break;
            }
        }
    };
});

rootController.controller('MapController', function ($state, $http,$ionicPopup, $stateParams, $scope, $ionicHistory,$cordovaInAppBrowser,$cordovaGeolocation, $interval, $ionicLoading, DistanceMetrix) {
   
    $scope.selected = $stateParams.context;
    var locations = window.globals.locations;
    var managers = window.globals.managers;
    var users = window.globals.users;
    var toLatitude;
    var toLongitude;
    var travelDetails={
        slag:'',
        slog:'',
        sAddressname:'',
        dlag:'',
        dlog:'',
        dAddressname:''
    }
    //$scope.offices = locations

    $scope.requestObj = 0;
    var address = globals.ServiceAddress;
    var method = globals.WebMethods.manager;
    $scope.report_to = window.globals.SESSION.user.reported_to;

    var ServiceEndPoint = address + method ;
    console.log(ServiceEndPoint);
    CallGetServive($http, ServiceEndPoint, function (response) {
        if (response != null) {

            if (response.data.managers !== "") {
                managers = response.data.managers;
                for (var i = 0; i < managers.length; i++) {
                    if (managers[i].username.toUpperCase() == users.username.toUpperCase()) {
                        managers.splice(i, 1);
                    }
                }
                $scope.managers = managers;
                window.globals.managers = managers;
            }
        }
        else {
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

    
    
    var pss35PlaceId = "ChIJqbzRKcBylR4RlgCGc5ZNODs";
    $scope.from = window.globals.loginUserslocation.address;
    $scope.isManager = window.globals.isManager;
    $scope.isAdmin = window.globals.isAdmin;

    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };

    var map;
    var requestObj= {
        distance: "",
        departure: "",
        destination: "",
        duration: ""
    };
    $scope.requestObj = requestObj;

    var interval;

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        
        
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //wpid = navigator.geolocation.watchPosition(geo_success, geo_error, { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 });
        getAddressFromLatLang(position.coords.latitude, position.coords.longitude);

        /*$interval( function () {
            var marker;

            marker = new google.maps.Marker({
                map: map,
                draggable: true,
                position: { lat: position.coords.latitude, lng: position.coords.longitude }
                //icon: 'img/small-van.png'
            });

            //var geocoder = new google.maps.Geocoder();
            //geocodePlaceId(geocoder);

            var lat = -26.0874414;
            var lng = 28.0829933;

            var from = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           
            var to = new google.maps.LatLng(toLatitude, toLongitude);
            var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
            var km = (dist / 1000).toFixed(1);
            
            requestObj = {
                distance: "",
                departure: "",
                destination: "",
                duration: ""
            };

            if (km == "NaN")
                requestObj.distance = "0";
            else
                requestObj.distance = "" + km;

            $scope.requestObj = requestObj;

            $scope.timeArrived = new Date(position.timestamp);
        }, 200);*/

        //navigator.geolocation.watchPosition( function() {

        //marker.setLatLng([position.coords.latitude, position.coords.longitude]);

        //});

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
        
    });

    function getAddressFromLatLang(lat,lng) {

        //console.log("Entering getAddressFromLatLang()");

        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(lat, lng);

        geocoder.geocode( { 'latLng': latLng}, function(results, status) {

            //console.log("After getting address");
            //console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                   // console.log(results[1]);
                    
                    $scope.from = results[1].formatted_address;
                    travelDetails.sAddressname = results[1].formatted_address;
                    travelDetails.slag = lat;
                    travelDetails.slog = lng;
                }
            }else{
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
       
       // console.log("Entering getAddressFromLatLang()");
    }

    function geocodeAddress(geocoder, resultsMap, place) {

        var address = place + " , South Africa";

        // retrieves address list containing all the necessary information [results parameter]
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {

                resultsMap.setCenter(results[0].geometry.location);

                var message = "";

                message += results[0].types[0];

                for (var i = 0; i < results[0].address_components.length; i++) {

                    message += "\n" + results[0].address_components[i].long_name;
                    message += "\n" + results[0].address_components[i].types[0];
                }

                message += "\n" + results[0].place_id;
                message += "\n" + results[0].geometry.location.lng();
                message += "\n" + results[0].geometry.location.lat();

                toLatitude = results[0].geometry.location.lat();
                toLongitude = results[0].geometry.location.lng()

                //alert(toLatitude + "and " + toLongitude);
                //var toAddress=getAddressFromLatLang(toLatitude, toLongitude);
                //alert(message);
                document.getElementById("btnsubmit").disabled = false;
                showToast("Address found, please verify the location on the map");

                $scope.requestObj.destination = $scope.model.to;

                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function geocodePlaceId(geocoder) {

            var placeId = pss35PlaceId;
            
            geocoder.geocode({ 'placeId': placeId }, function (results, status) {

                if (status === 'OK') {
                    if (results[0]) {
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
    }

    function getDistanceMetrixBetweenLocations(depature, destination){

        var results = null;

        var ServiceEndPoint = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + depature  + "&destinations=" + destination;

        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null && response.data != "") {

                results = response.data; // returns distanceMatrix Object "includes array[destination_addresses], string: origin_addresses, object(distance), object(duration)"
            }
        });

        return results;
    }

        
        
        
        $scope.openmaps =function()
        {//window.open('https://twitter.com/gajotres', '_system', 'location=no');
            window.open('https://www.google.co.za/maps/dir/'+travelDetails.slag+','+travelDetails.slog+'/'+travelDetails.dAddressname, '_system', 'location=no');
        }

    $scope.searchPlace = function (place) {
   travelDetails.dAddressname = place
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            showLoading($ionicLoading, "Please wait...");

            var geocoder = new google.maps.Geocoder();

            geocodeAddress(geocoder, map, place);

            DistanceMetrix.getDistanceMetrixBetweenLocations($scope.from, place + " , South Africa").then( function(response) {

                if (response != null && response.data != "") {

                    var distanceMatrixObj = response.data;

                    if(distanceMatrixObj.rows[0].elements[0].status == "OK") {

                        $scope.requestObj.distance = distanceMatrixObj.rows[0].elements[0].distance.text;
                        $scope.requestObj.departure = distanceMatrixObj.origin_addresses[0];
                        $scope.requestObj.destination = distanceMatrixObj.destination_addresses[0];
                        $scope.requestObj.duration = distanceMatrixObj.rows[0].elements[0].duration.text;

                        var directionsService = new google.maps.DirectionsService();
                        var directionsDisplay = new google.maps.DirectionsRenderer();
                    
                        map = new google.maps.Map(document.getElementById('map'), {
                            zoom:7,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                        
                        directionsDisplay.setMap(map);
                        document.getElementById("panel").innerHTML = "";
                        directionsDisplay.setPanel(document.getElementById('panel'));
                    
                        var request = {
                            origin: $scope.requestObj.departure, 
                            destination: $scope.requestObj.destination,
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        };
                    
                        directionsService.route(request, function(response, status) {

                            if (status == google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            }
                        });
                    } else {

                        $scope.requestObj.distance = "Destination is beyond boundries";
                        $scope.requestObj.departure = distanceMatrixObj.origin_addresses[0];
                        $scope.requestObj.destination = distanceMatrixObj.destination_addresses[0];
                        $scope.requestObj.duration = "Destination is beyond boundries";
                    }
                }
            });

            hideLoading($ionicLoading);

        }, function (error) {
        
            alert("Could not get location");
        });
    };

    $scope.log = function(requestObj) {
        $ionicLoading.show({
        template: 'please wait...'
        });
        var theDistance = requestObj.distance;
        var depature = requestObj.departure;
        var destination = requestObj.destination;

        function toMonth(theDate) {

            switch (theDate) {

                case 1:
                    return "Jan"
                case 2:
                    return "Feb"
                case 3:
                    return "Mar"
                case 4:
                    return "Apr"
                case 5:
                    return "May"
                case 6:
                    return "Jun"
                case 7:
                    return "Jul"
                case 8:
                    return "Aug"
                case 9:
                    return "Sep"
                case 10:
                    return "Oct"
                case 11:
                    return "Nov"
                default:
                    return "Dec"
            }
        }

        var start = new Date();
        var theDate = (start.getUTCDate() + 1) + " " + toMonth(start.getMonth() + 1) + " " + start.getFullYear();

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function formatTime() {

            var d = new Date().toLocaleString();

            //var h = addZero(d.getHours());
            //var m = addZero(d.getMinutes());
            //var s = addZero(d.getSeconds());

            //return h + ":" + m;
            return d;
        }
        
        var theRequestObj;

        if (window.globals.LeaverequestsList.length > 0) {
            
            theRequestObj = {
                id: Number(window.globals.claimsList[window.globals.claimsList.length - 1].id) + 1,
                name: users.firstName + " " + users.lastName,
                reason: $scope.selected,
                slocation: depature,
                dlocation: destination,
                date: theDate,
                stime: formatTime(),
                dtime: formatTime($scope.timeArrived),
                distance: theDistance,
                approver: $scope.model.approver,
                status: 'In Progress'
            };
        }
        else {

            theRequestObj = {
                id: 1,
                name: users.firstName + " " + users.lastName,
                reason: $scope.selected,
                slocation: depature,
                dlocation: destination,
                date: theDate,
                stime: formatTime(),
                dtime: formatTime($scope.timeArrived),
                distance: theDistance,
                approver: $scope.model.approver,
                status: 'In Progress'
            };
        }

        var method = globals.WebMethods.businesstrip;
        //var users = window.globals.users;
        //alert($scope.model.approver.username);
        var parameter = "?userId=" + users.id + "&name=" + users.firstName+" "+ users.lastName + "&slocation=" + depature + "&dlocation=" + destination + "&stime=" + formatTime() + "&dtime=" + formatTime($scope.timeArrived) + "&distance=" + theDistance + "&reason=" + $scope.selected + "&approver=" + $scope.model.approver + "&status=In Progress";
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        var ServiceEndPoint = address + method + parameter;
        //alert(ServiceEndPoint);
        //console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {

            if (response != null) {

                if (response.data.BusinessTrip == "") {
                    alert("Not submitted");
                }
                else {

                    window.globals.claimsList.push(theRequestObj);
                    window.globals.SESSION.userClaimsList.push(theRequestObj);
                    showToast("Your Travel Claim has been processed.");
                    $ionicLoading.hide();
                    $scope.openmaps();
                }

            }
            else
            {
                $ionicLoading.hide();
                alert("System error in Business trip api");
            }
        });



        //window.globals.claimsList.push(requestObj);
        //window.globals.SESSION.userClaimsList.push(requestObj);

    };

    //$scope.changedValue = function (item) {
    //    //alert(item);
    //    if (item == "14") {

    //        document.getElementById("lblotherOffice").style.display = "block";
    //    }
    //    else {
    //        document.getElementById("lblotherOffice").style.display = "none";
    //    }

    //};
});