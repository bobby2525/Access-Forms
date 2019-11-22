/**
 * Canada Olympic House Registration
 * Canadian Olympic Committee
 * Jivan Maharaj
 * jmaharaj@olympic.ca
 **/
$(document).ready(function () {

    $('#dob').on('changeDate', function () {
        //var today = new Date();
        //var day = today.getDay();
        //var month = today.getMonth();
        //var year = today.getFullYear();
        //var dd = year + '-' + month + '-' + day;
        //console.log($(this).val());
        ////console.log(dd);
        //if ($(this).val() == dd)
        //{
        //    $(this).val('');
        //}
    });
});

var app = angular.module('profile-app', ['$strap.directives', 'flashr']);

//Provision for Cross-Origin Resource Sharing
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}

]);
app.controller('profile-form', function ($scope, $http, flashr) {
    $scope.postError = false;
    $scope.locked = true;
    $scope.submitted = false;
    $scope.processing = false;
    var template = {};
    $scope.travel = '';
    $scope.travelComplete = false;
    $scope.errorMessage = false;
    $scope.success = false;
    $scope.check = function () {

        if ($scope.login.$valid) {
            $scope.processing = true;
            var dx = $scope.form;

            $http.post('http://sochi-x-data.olympic.ca/api/profile', dx)
                .success(function (data) {
                    if (data == "null") {
                        $scope.processing = false;
                        $scope.submitted = false;
                        $scope.errorMessage = true;
                    }
                    else {
                        $scope.travel = data;
                        $scope.locked = false;
                        $scope.processing = false;
                        $scope.errorMessage = false;
                    }
                })
                .error(function (data) {
                    $scope.processing = false;


                });
        }
    };
    $scope.updateRecord = function ()
    {
        $scope.postError = false;
        if ($scope.gamma.$valid) {
            $http.post('http://sochi-x-data.olympic.ca/api/update', $scope.travel)
                .success(function (data) {
                    if (data != "null") {
                        $scope.locked = true;
                        $scope.success = true;
                    }
                    else {
                        $scope.postError = true;
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        }
        else {
            var errors = $scope.gamma.$error;
           
        }
        
    }
    $scope.cancel = function ()
    {
        $scope.form = angular.copy(template);
        if (location.search) {
            var params = {};
            var parts = location.search.substring(1).split('&');
            for (var i = 0; i < parts.length; i++)
            {
                var values = parts[i].split('=');
                if (!values[0]) continue;
                params[values[0]] = values[1] || true;
                
            }
            
            $scope.form.id = params.application_id;
        }
        else {
            
        }
        
    }
    $scope.cancel();
});