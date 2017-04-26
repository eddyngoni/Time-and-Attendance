/**
 *  @author: Koketso Gift Matlhatsi
 *  @technical-support:
 *      email: Koketso42@gmail.com
 *      phone: 071 530 2436 
 *      
 *  @page-info:
 *      
 *      App helper methods
 */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var dist = R * c; // Distance in km

    //dist = parseFloat(dist);
    var m = dist * 1000; //converting km to meters

    return m;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function distance(lat1, lon1, lat2, lon2, unit) {

    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
        dist = dist * 1.609344;
    }

    if (unit == "N") {
        dist = dist * 0.8684;
    }

    return dist
}

// app popup dialog

function showMessageDialog($ionicPopup, title, message) {

    var popup = $ionicPopup.show({
        title: title,
        template: message,
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
        popup.close();
    });
}

function showConfirmDialog($ionicPopup, title, message, callback) {

    var popup = $ionicPopup.confirm({
        title: title,
        template: message
    });

    popup.then(function (res) {
        
        if(res) {

            callback(res);
        } else {

            callback(null);
            popup.close();
        }
    });
}

// app loading spinner
function showLoading($ionicLoading, title) {

    $ionicLoading.show({
        template: title,
        duration: 3000
    }).then(function () {

    });
}

function hideLoading($ionicLoading) {

    $ionicLoading.hide().then(function () {

    });
}

/**
 * 
 * Fingerprint Authentication
 * 
 */

// Android Fingerprint Authentication
function checkFingerprintScanner() {

}

function showFingerptintAuthentication() {
    
}

// iOS TouchID
function checkFingerprintScanner() {

}

function showFingerptintAuthentication() {
    
}