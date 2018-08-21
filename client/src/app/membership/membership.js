angular.module('membership', [])
.controller('membershipController', ['$scope', '$http', '$resource', '$log',  function ($scope, $http, $resource, $log) {

  $scope.showMembershipForm = true;
  $scope.showMembershipResult = false;
  $scope.membershipType = "family";
  $scope.showFamily = true;

  $scope.submit = function(isValid) {
    $http({
      method: 'POST',
      url: '/api/member',
      data: {
        type:$scope.membershipType,
        member: {
          name: $scope.name,
          emailID:  $scope.email,
          contactNo: $scope.contactNo
        },
        spouse: {
          name:  $scope.spouseName,
          emailID: $scope.spouseEmail,
          contactNo: $scope.spouseContactNo
        },
        noOfChildren: $scope.noOfChildren
      }
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        if ($scope.membershipType == "family") {
          $scope.successResponse = {"membershipFees": 25};
        } else {
          $scope.successResponse = {"membershipFees": 15};
        }
        $scope.regResult = {
            status: "SUCCESS"
        };
        $scope.showMembershipForm = false;
        $scope.showMembershipResult = true;
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.$scope.regResult = {
        $scope.errors = {"error": "Something went wrong. Please try again."};
        $scope.regResult = {
            status: "ERROR"
        };
        //scope.showRegForm = false;
        //$scope.showRegResult = true;
    });
};

$scope.reset = function () {
    $scope.showMembershipForm = true;
    $scope.showMembershipResult = false;
};

$scope.handleRadioClick = function(){
    if ($scope.membershipType == "family") {
      $scope.showFamily = true;
    } else {
      $scope.showFamily = false;
    }


};

}]);
