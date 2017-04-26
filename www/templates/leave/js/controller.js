/**
 *  @author: kiran chakravarthi challagali
 *  @technical-support:
 *  email: kiran.challagali@providencesoft.com
 *  phone: +91 8886662322 
 *      
 *  @page-info:
 *  
 *      
 */

rootController.controller('LeaveController', function ($http,$state, $scope, $ionicHistory) {
   
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };
   
    var address;
    var method;
    var ServiceEndPoint;

    var managers = window.globals.managers;
    var users = window.globals.users;
    
    if (jQuery.isEmptyObject(managers)) {
       
        address = globals.ServiceAddress;
        method = globals.WebMethods.manager;

        ServiceEndPoint = address + method;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.managers !== "") {
                    managers = response.data.managers;
                    //$scope.managers = managers;
                    
                    window.globals.managers = managers;
                    //alert(managers.length);
                    for (var i = 0; i < managers.length; i++) {
                        //alert(managers[i].username.toUpperCase() + " == " + users.username.toUpperCase());
                        if (managers[i].username.toUpperCase() == users.username.toUpperCase()) {                          
                            managers.splice(i, 1);
                        }
                    }

                    $scope.managers = managers;
                    
                }
            }
            else
                alert("System error in Managers API");
        });
    }
   
    $scope.managers = managers;

    window.globals.SESSION.userLeaveRequestsList = [];
    var userLeaveRequestsList = window.globals.SESSION.userLeaveRequestsList;
    var LeaverequestsList = window.globals.LeaverequestsList;
    var userEmpRequestsList = [];
    address = globals.ServiceAddress;
    method = globals.WebMethods.getleaverequests;

    ServiceEndPoint = address + method;
    console.log(ServiceEndPoint);
    $scope.isManager = window.globals.isManager;
    $scope.isAdmin = window.globals.isAdmin;

    CallGetServive($http, ServiceEndPoint, function (response) {
        if (response != null) {

            if (response.data.LeaveRequests !== "") {
                LeaverequestsList = response.data.LeaveRequests;
                //alert(LeaverequestsList.length);
                window.globals.LeaverequestsList = response.data.LeaveRequests;



                for (var x = 0; x < LeaverequestsList.length; x++) {

                    if (LeaverequestsList[x].UserId === window.globals.SESSION.user.id) {
                        
                        userLeaveRequestsList.push(LeaverequestsList[x]);
                    }
                }

                $scope.requestsList = userLeaveRequestsList;

                

                for (var x = 0; x < LeaverequestsList.length; x++) {
                    if ($scope.isAdmin) {
                        if (LeaverequestsList[x].UserId !== window.globals.SESSION.user.id ) {

                            userEmpRequestsList.push(LeaverequestsList[x]);
                        }
                    }
                    else if ($scope.isManager) {
                        if (LeaverequestsList[x].UserId !== window.globals.SESSION.user.id && LeaverequestsList[x].Approver.toUpperCase() == window.globals.SESSION.user.username.toUpperCase()) {

                            userEmpRequestsList.push(LeaverequestsList[x]);
                        }
                    }
                }

                $scope.requestsList = userLeaveRequestsList;

                $scope.empRequestsList = userEmpRequestsList;

                if ($scope.isManager)
                    $scope.isEmpTab = $scope.isManager;
                else if ($scope.isAdmin){
                    $scope.isEmpTab = $scope.isAdmin;
                    $scope.isManager = $scope.isAdmin;
                    
                }
                else
                    $scope.isEmpTab = $scope.isManager;

                $scope.isHistory = false;
                $scope.isNew = false;

                if (!$scope.isManager && !$scope.isAdmin) {
                    $scope.isHistory = true;
                }
            }
        }
        else
            alert("System error in Get Leave Requests API");
    });

   

    

    $scope.leaveDetails = function(request) {

        $state.go('app.leaveDetails', { 'context': angular.toJson(request) });
        //$state.go('app.leaveDetails', { 'context': JSON.stringify(request) });
    };
    
    $scope.isEmpTab = $scope.isManager;
    $scope.isHistory = false;
    $scope.isNew = false;

    if(!$scope.isManager) {
        $scope.isHistory = true;
    }

    $scope.history = function() {

        $scope.isEmpTab = false;
        $scope.isHistory = true;
        $scope.isNew = false;
    };

    $scope.applyLeave = function() {

        $scope.isEmpTab = false;
        $scope.isHistory = false;
        $scope.isNew = true;
       
    };

    $scope.requests = function() {

        $scope.isEmpTab = true;
        $scope.isHistory = false;
        $scope.isNew = false;
        
    };

    $scope.apply = function(leaveType, startD, endD, comments, approver) {

        function toMonth(theDate) {
            
            switch(theDate) {

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

        var start = new Date(startD);
        var startDate = (start.getUTCDate()+1) + " " + toMonth(start.getMonth()+1) + " " + start.getFullYear();
        
        var end = new Date(endD);
        var endDate = (end.getUTCDate() + 1) + " " + toMonth(end.getMonth() + 1) + " " + end.getFullYear();
        var requestObj;
        //var users = window.globals.users;
        if (window.globals.LeaverequestsList.length > 0) {
            var requestObj = {
                Id: Number(window.globals.LeaverequestsList[window.globals.LeaverequestsList.length - 1].Id) + 1,
                EmpName: users.firstName + " " + users.lastName,
                LeaveType: leaveType,
                StartDate: startDate,
                EndDate: endDate,
                Comments: comments,
                Approver: approver,
                Status: 'In Progress'
            };
        }
        else {
            var requestObj = {
                Id: 1,
                EmpName: users.firstName + " " + users.lastName,
                LeaveType: leaveType,
                StartDate: startDate,
                EndDate: endDate,
                Comments: comments,
                Approver: approver,
                Status: 'In Progress'
            };

        }
        
        
        method = globals.WebMethods.submitleave;
        
        var parameter = "?userId=" + users.id + "&name=" + users.firstName + " " + users.lastName + "&leavetype=" + leaveType + "&sdate=" + startDate + "&edate=" + endDate + "&comments=" + comments + "&approver=" + approver + "&status=In Progress";
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.LeaveApplication !== "") {

                    window.globals.LeaverequestsList.push(requestObj);
                    window.globals.SESSION.userLeaveRequestsList.push(requestObj);

                    showToast("Your Leave Application has been processed.");

                    $scope.model = null;
                }
            }
        });

       
        
    };
});

rootController.controller('LeaveDetailsController', function ($http,$state, $stateParams, $scope, $ionicHistory) {

    $scope.requestObj = JSON.parse($stateParams.context);

    var LeaverequestsList = window.globals.LeaverequestsList;

    var address = globals.ServiceAddress;
    var method = globals.WebMethods.updateleaverequest;
    var parameters;

    $scope.approve = function (request) {

        for (var x = 0; x < LeaverequestsList.length; x++) {



            if (LeaverequestsList[x].Id == request.Id) {


                parameters = "?Id=" + request.Id + "&Status=Approved";
                var ServiceEndPoint = address + method + parameters;
                console.log(ServiceEndPoint);
                CallGetServive($http, ServiceEndPoint, function (response) {
                    if (response != null) {

                        if (response.data.LeaveRequest !== "") {

                            LeaverequestsList[x].Status = "Approved";
                            $scope.requestObj = LeaverequestsList[x];

                            window.globals.LeaverequestsList = [];
                            window.globals.LeaverequestsList = LeaverequestsList;


                        }
                    }
                });

                break;
            }
        }

        
    };

    $scope.reject = function(request) {

        for (var x = 0; x < LeaverequestsList.length; x++) {



            if (LeaverequestsList[x].Id == request.Id) {


                parameters = "?Id=" + request.Id + "&Status=Declined";
                var ServiceEndPoint = address + method + parameters;
                console.log(ServiceEndPoint);
                CallGetServive($http, ServiceEndPoint, function (response) {
                    if (response != null) {

                        if (response.data.LeaveRequest !== "") {

                            LeaverequestsList[x].Status = "Declined";
                            $scope.requestObj = LeaverequestsList[x];

                            window.globals.LeaverequestsList = [];
                            window.globals.LeaverequestsList = LeaverequestsList;


                        }
                    }
                });

                break;
            }
        }
    };
});
