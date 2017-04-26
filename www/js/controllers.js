/**
 *  @author: Koketso Gift Matlhatsi
 *  @technical-support:
 *      email: Koketso42@gmail.com
 *      phone: 071 530 2436 
 *      
 *  @page-info:
 *  
 *      This is the parent controller declaration, all other controllers will inherit from this parent controller (rootController)
 */


// declare root controller
var rootController = angular.module('pss.controllers', ['ngCordova', 'ngCordova.plugins.device']);

rootController.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

});

rootController.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
});

rootController.controller('PlaylistCtrl', function ($scope, $stateParams) {

});
