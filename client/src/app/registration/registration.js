angular.module('registration', ['event']).controller('registrationController', ['$scope', '$http', '$resource', '$log', 'eventService', function ($scope, $http, $resource, $log, eventService) {
    $scope.showRegForm = true;
    $scope.showRegResult = false;
    
    $scope.submit = function () {
        $http({
            method: 'POST',
            url: '/api/registration',
            data: {
                year: $scope.year,
                eventCode: $scope.eventCode,
                eventName: $scope.eventName,
                data: {
                    name: $scope.name,
                    email: $scope.email,
                    isMember: $scope.isMember,
                    hasFamily: $scope.hasFamily,
                    isStudent: $scope.isStudent,
                    isVegetarian: $scope.isVegetarian,
                    noOfAdults: Number($scope.noOfAdults),
                    noOfChildren: Number($scope.noOfChildren),
                    eventFee: $scope.eventFee,
                    sponsorshipCategory: $scope.sponsorshipCategory,
                    specialNote: $scope.specialNote
                }
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.successResponse = response.data;
            $scope.regResult = {
                status: "SUCCESS"
            };
            $scope.showRegForm = false;
            $scope.showRegResult = true;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.$scope.regResult = {
            $scope.errors = response.data;
            $scope.regResult = {
                status: "ERROR"
            };
            //scope.showRegForm = false;
            //$scope.showRegResult = true;
        });
    };

    $scope.reset = function () {
        $scope.showRegForm = true;
        $scope.showRegResult = false;
    };

}]);