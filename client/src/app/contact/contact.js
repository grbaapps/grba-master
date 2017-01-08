angular.module('contact', []).controller('contactController', ['$scope', '$http', '$resource', '$log', function ($scope, $http, $resource, $log) {
    
    $scope.submit = function () {
        alert("This feature is coming soon. Please click on the link info@grbaonline.org for now.");
    };

    $scope.reset = function () {
        
    };

}]);