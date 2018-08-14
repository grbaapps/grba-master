angular.module('membership', [])
.controller('membershipController', ['$scope', '$http', '$resource', '$log',  function ($scope, $http, $resource, $log) {
  $scope.submit = function() {

//Todo - comment out below section. this is just for testing.  Don't forgrt to comment or delete after merge
var test = {
  membershipType:$scope.membershipType,
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
noOfChildren: $scope.childrenCount
}
alert(JSON.stringify(test));
//End - testing. Don't forgrt to comment or delete after merge


    $http({
      method: 'POST',
      url: '/api/membership',
      data: {
        membershipType:$scope.membershipType,
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
    noOfChildren: $scope.childrenCount
      }
    }).then(function successCallback(response) {

      //todo - handle success response
    }, function errorCallback(response) {
      //todo - handle error
    });
  };
}]);