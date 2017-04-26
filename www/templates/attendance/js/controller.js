/**
 *  @author: Koketso Gift Matlhatsi
 *  @technical-support:
 *      email: Koketso42@gmail.com
 *      phone: 071 530 2436 
 *      
 *  @page-info:
 *      
 */

// 
rootController.controller('MeetingController', function($state, $scope, $ionicHistory, $timeout, $cordovaGeolocation, $interval) {
    
    var staticList = [
        { 
            title: 'Internal Staff Meeting',
            description: 'Occurs every Monday effective 2016/09/26 until 2016/12/26 from 11:30 AM to 12:30 PM',
            time: '11:30 AM',
            duration: '30-45 mins',
            viewed: false
        },
        { 
            title: 'Tender Meeting',
            description: 'Updates on latest tenders 2017',
            time: '09:30 AM',
            duration: '30 mins',
            viewed: false
        },
        { 
            title: 'RTT',
            description: 'Occurs every Wednesday from 10:00 AM to 10:30 AM',
            time: '10:00 AM',
            duration: '30 mins',
            viewed: false
        }
    ];
    
    $scope.meetings = staticList;
    
    $scope.respond = function(id) {
        
        staticList.splice(id, 1);
        $scope.meetings = staticList;
    };
});