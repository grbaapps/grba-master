angular.module('registration', ['event']).controller('registrationController', ['$scope', '$resource', '$log', 'eventService', function ($scope, $resource, $log, eventService) {
    $scope.showRegForm = true;
    $scope.showRegResult = false;

    $scope.submit = function () {
        var regAPI = $resource("/api/registration");
        $scope.regResult = {
            status: "PENDING"
        };

        regAPI.save({
            year: $scope.year,
            eventCode: $scope.eventCode,
            eventName: $scope.eventName,
            data: {
                name: $scope.name,
                email: $scope.email,
                isMember: $scope.isMember,
                hasFamily: $scope.hasFamily,
                isStudent: $scope.isStudent,
                isVegiterian: $scope.isVegiterian,
                noOfAdults: $scope.noOfAdults,
                noOfChildren: $scope.noOfChildren,
                eventFee: $scope.eventFee,
                specialNote: $scope.specialNote
            }
        }, function (data) {
            $scope.regResult = data;
            $log.info(data);
        });
        $scope.showRegForm = false;
        $scope.showRegResult = true;
        $log.info($scope);
    };

    $scope.reset = function () {
        $scope.showRegForm = true;
        $scope.showRegResult = false;
    };

}]);