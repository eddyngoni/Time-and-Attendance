/**
 *  @author: kiran chakravarthi
 *  @technical-support:
 *      email: kiran.challagali@providencesoft.com
 *      phone: +91 8886662322 
 *      
 *  @page-info:
 *  
 *      This is the parent controller declaration, all other controllers will inherit from this parent controller (rootController)
 */

// declare root controller

var rootService = angular.module('pss.services', ['ionic', 'ngCordova']);

rootService.factory('GeoAlert', function ($http,$ionicPlatform,$cordovaGeolocation) {
    
    console.log('GeoAlert service instantiated');
    var interval;
    var duration = 6000;
    var Offlong, Offlat, Currlat, Currlong;
    var processing = false;
    var callback;
    var minDistance = 100;
    var request;
    
     
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        var m = d * 1000;  //Distance in Meters
        return m; 
    }
  
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 2700000 };
    function getCurrentLocations() {
        
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            console.log("lat:" + position.coords.latitude + "\n lng:" + position.coords.longitude);

            Currlat = position.coords.latitude;
            Currlong = position.coords.longitude;
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
            alert(error.message);
            console.log("Could not get location");
            alert("Could not get location");
            //return;
        });

        /*if(isLoggedIn) {
            alert("PSS #35");
        } else {
            alert("Logging out...");
        }*/


    }
   
    function hb() {
        
        console.log('hb running');
        if(processing) return;
        processing = true;

        getCurrentLocations();
        //$cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        
        //navigator.geolocation.getCurrentPosition(success, failure, options);
        //function success(position){
            processing = false;
            console.log(Offlat, Offlong);
            console.log(Currlat, Currlong);
            var dist = getDistanceFromLatLonInKm(Offlat, Offlong, Currlat, Currlong);
            console.log("dist in meters is " + dist);
            //alert("current dist: " + dist + " && minimum distance: " + minDistance);
            console.log(request);
            if (request == "checkout") {
                if (dist >= minDistance) callback();
            }
            else {
                if (dist <= minDistance) callback();
            }

        //}
        //function failure(positionError) {
        //    alert(positionError);
        //}
        //}, function (error) {
        //    console.log("Could not get location");
        //});
    }
   
    return {
        begin: function (Offlt, Offlg, Currlt, Currlg, req, cb) {
            
            Offlong = Offlg;
            Offlat = Offlt;
            Currlat = Currlt;
            Currlong = Currlg;
            callback = cb;
            request = req;

            interval = window.setInterval(hb, duration);
            hb();
        }, 
        end: function() {
            window.clearInterval(interval);
        },
        setTarget: function(lg,lt) {
            long = lg;
            lat = lt;
        }
    };

    return {
        set: function (key, value) {
            return localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        destroy: function (key) {
            return localStorage.removeItem(key);
        },
    };


   
});