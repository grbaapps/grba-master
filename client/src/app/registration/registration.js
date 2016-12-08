angular.module('registration',['event']).controller('registrationController', ['$scope', '$resource', '$log', 'eventService', function($scope, $resource,  $log, eventService) {
    $scope.showRegForm = true;
    $scope.showRegResult = false;
    
    $scope.submit = function() {
        var regAPI = $resource("/api/register");
        $scope.regResult = {status: "PENDING"};
    
       regAPI.save({ name: $scope.name, amount: $scope.amount }, function(data) {
             $scope.regResult = data;
             $log.info(data);
        });
        $scope.showRegForm = false;
        $scope.showRegResult = true;
        $log.info($scope);
    };
    
    $scope.reset = function() {
        $scope.showRegForm = true;
        $scope.showRegResult = false;
    };
    
}]);
