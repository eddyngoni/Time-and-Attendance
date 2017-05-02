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

rootController.controller('TimesheetController', function ($http,$state, $scope, $ionicHistory) {
   
    $scope.onDragLeft = function() {
        closeNav();
    };

    $scope.onDragRight = function() {
        openNav();
    };

    var address = globals.ServiceAddress;
    var method;
    var param;
    var ServiceEndPoint;

    var employees = window.globals.employees;
    var users = window.globals.users;
    
    if (jQuery.isEmptyObject(employees)) {
       
        //address = globals.ServiceAddress;
        method = window.globals.WebMethods.getallemployees;
        param = "?username=" + window.globals.SESSION.user.username + "&user_role=" + window.globals.SESSION.user.user_role;
        
        ServiceEndPoint = address + method + param;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.employees !== "") {
                    employees = response.data.GetAllEmployees;
                    //$scope.managers = managers;
                    
                    window.globals.employees = employees;
                    //alert(managers.length);
                    for (var i = 0; i < employees.length; i++) {
                        //alert(managers[i].username.toUpperCase() + " == " + users.username.toUpperCase());
                        if (employees[i].username.toUpperCase() == users.username.toUpperCase()) {
                            employees.splice(i, 1);
                        }
                    }

                    $scope.employees = employees;
                    
                }
            }
            else
                alert("System error in GetEmployees API");
        });
    }
   
    $scope.employees = employees;

   
    $scope.isManager = window.globals.isManager;
    $scope.isAdmin = window.globals.isAdmin;
// viewing time sheet status
    $scope.gettimesheet_view = function (fromdate, todate) {
   
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

        var fromD = new Date(fromdate);
        var Fdate = (fromD.getUTCDate() + 1) + " " + toMonth(fromD.getMonth() + 1) + " " + fromD.getFullYear();

        var toD = new Date(todate);
        var Tdate = (toD.getUTCDate() + 1) + " " + toMonth(toD.getMonth() + 1) + " " + toD.getFullYear();

        //address = globals.ServiceAddress;
        method = globals.WebMethods.gettimesheets;
        var parameter = "?userId=" + users.id + "&fromdate=" + Fdate + "&todate=" + Tdate;
        ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {
                
                if (response.data.GetTimesheets !== "") {
                    //employees = response.data.employees;
                    //$scope.managers = managers;
                    
                    window.globals.employeetimesheet = response.data.GetTimesheets;
                    $state.go('app.timesheetview');

                }
                else
                    alert("Record not found!");
            }
            else
                alert("System error in GetEmployees API");
        });


    };

// getting time sheet to be approve
    $scope.gettimesheet = function (empid, fromdate, todate) {

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

        var fromD = new Date(fromdate);
        var Fdate = (fromD.getUTCDate() + 1) + " " + toMonth(fromD.getMonth() + 1) + " " + fromD.getFullYear();

        var toD = new Date(todate);
        var Tdate = (toD.getUTCDate() + 1) + " " + toMonth(toD.getMonth() + 1) + " " + toD.getFullYear();

        //address = globals.ServiceAddress;
        method = globals.WebMethods.gettimesheets;
        var parameter = "?userId=" + empid + "&fromdate=" + Fdate + "&todate=" + Tdate;
        ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {
                
                if (response.data.GetTimesheets !== "") {
                    //employees = response.data.employees;
                    //$scope.managers = managers;
                    
                    window.globals.employeetimesheet = response.data.GetTimesheets;
                    $state.go('app.timesheetDetails', null, { reload: true });

                }
                else
                    alert("Record not found!");
            }
            else
                alert("System error in GetEmployees API");
        });

        //$state.go('app.timesheetDetails', { 'context': angular.toJson() });
        
        //$state.go('app.leaveDetails', { 'context': JSON.stringify(request) });
    };

    if(!$scope.isManager && $scope.isAdmin) {
        $scope.isManager = $scope.isAdmin;
    }

    $scope.isEmpTab = $scope.isManager;
    $scope.isView = false;
    $scope.isNew = false;

    if(!$scope.isManager) {
        $scope.isView = true;
    }    

    $scope.submitTimesheet = function () {

        $scope.isEmpTab = false;
        $scope.isView = false;
        $scope.isNew = true;
    };

    $scope.getTimesheets = function () {

        $scope.isEmpTab = true;
        $scope.isView = false;
        $scope.isNew = false;
    };
    $scope.getview = function()
    {
        $scope.isEmpTab = false;
        $scope.isView = true;
        $scope.isNew = false;
       
    }

    $scope.submit = function (morningsession, afternoonsession, timesheetdate) {

        //alert("hai");

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

        var start = new Date(timesheetdate);
        var date = (start.getUTCDate()+1) + " " + toMonth(start.getMonth()+1) + " " + start.getFullYear();
        var user = window.globals.SESSION.user;
        
        //alert(globals.WebMethods.submittimesheet);
        
        method = globals.WebMethods.submittimesheet;
        //alert(method);
        var parameter = "?userId=" + user.id + "&name=" + user.firstName + " " + user.lastName + " " + user.surName + "&morningsession=" + morningsession + "&afternoonsession=" + afternoonsession + "&timesheetdate=" + date ;
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        ServiceEndPoint = address + method + parameter;
        console.log(ServiceEndPoint);
        alert(ServiceEndPoint);
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.TimesheetApplication !== "") {

                    
                    showToast("Your timesheet entry successfully submitted.");

                    $scope.model = null;
                }
            }
        });

       
        
    };



});

rootController.controller('timesheetDetailsController', function ($http,$state, $stateParams, $scope, $ionicHistory) {

   
    
    var employeetimesheet = window.globals.employeetimesheet;
    var address = globals.ServiceAddress;
    
    $scope.timesheetDetails = employeetimesheet;
    // Approve Time Sheet
    $scope.isStatus = function (timesheet, index)
    {
            if(timesheet.approve=='Y')
            {
            $scope.sheet_status="Approved";
            (window.globals.employeetimesheet)[index].approve = timesheet.approve;
            return false;
            }
            else if(timesheet.approve=='N')
            {
            $scope.sheet_status="Declined";
            return false;
            }
            else
            {
            $scope.sheet_status = "In Progress";
            return true;
            }
    
    }
     $scope.time_sheet_aprove = function (timesheet, index) {

        method = globals.WebMethods.ApproveTimeSheet_func;
        //alert(method);
        var parameter = "?userId=" + timesheet.Id + "&timesheet=" + timesheet.TimesheetDate+'&status=Y';
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        ServiceEndPoint = address + method + parameter;
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.st !== "") {

                    
                    showToast("successfully approved");
                    timesheet.approve = 'Y';
                    $scope.isStatus(timesheet, index);
                   // $scope.model = null;
                }
            }
        });

       
        
    };


    //view time sheet status

   
//Disapprove time sheet
    $scope.time_sheet_disaprove = function (timesheet, index) {

        method = globals.WebMethods.ApproveTimeSheet_func;
        //alert(method);
        var parameter = "?userId=" + timesheet.Id + "&timesheet=" + timesheet.TimesheetDate+'&status=N';
        //var paremeter = "?username=patchala&password=wildlife";
        //alert(parameter);
        ServiceEndPoint = address + method + parameter;
        CallGetServive($http, ServiceEndPoint, function (response) {
            if (response != null) {

                if (response.data.st !== "") {

                    
                    showToast("successfully Disapproved");
                    timesheet.approve = 'N';
                    $scope.isStatus(timesheet, index);
  
                   // $scope.model = null;
                }
            }
        });
    };

    $scope.auto_timesheet_apporve = function (timesheet, index){

        method = globals.WebMethods.ApproveTimeSheet_func;
        var oneDay = 24*60*60*1000;
        var today = new Date();
        var date_submited = new Date(timesheet.Created_On);
        var diffDays = Math.round(Math.abs((date_submited.getTime()-today.getTime())/(oneDay)));
        var user = window.globals.SESSION.user;
        
        if(diffDays>4 && timesheet.approve==null) {
            
            var parameter = "?userId=" + timesheet.Id + "&timesheet=" + timesheet.TimesheetDate+'&status=Y';
            //var paremeter = "?username=patchala&password=wildlife";
            //alert(parameter);
            ServiceEndPoint = address + method + parameter;

            CallGetServive($http, ServiceEndPoint, function (response) {
                if (response != null) {

                    if (response.data.st !== "") {

                        timesheet.approve = 'Y';
                        $scope.isStatus(timesheet, index);
                    }
                }
            });
            
        }
    }

});
