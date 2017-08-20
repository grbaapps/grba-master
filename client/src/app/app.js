angular.module('grbaApp', [
  'ngRoute',
  'ngResource',
  'registration',
  'event',
  'contact',
  'services.i18nNotifications',
  'templates.app',
  'templates.common',
  'angular-toArrayFilter']);
angular.module('myApp', ['']);
angular.module('grbaApp').constant('GRBA_APP_CONFIG', {
  // Any application constants go here
  "dateTimeFormat": "MM-DD-YYYY hh:mm:ss" //need to write service to load app config from server. This is temporary.
});

//TODO: move those messages to a separate module
angular.module('grbaApp').constant('I18N.MESSAGES', {
  'errors.route.changeError':'Route change error',
  'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
  'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});

angular.module('grbaApp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

    $routeProvider
    .when("/", {
        templateUrl : "html2/home.html"
    })
    .when("/event", {
        templateUrl : "html2/event.html"
    })
    .when("/nextevent", {
        templateUrl : "html2/event.html"
    })
    .when("/about", {
        templateUrl : "html2/about.html"
    })
    .when("/contact", {
        templateUrl : "html2/contact.html"
    })
    .when("/board", {
        templateUrl : "html2/board.html"
    })
    .otherwise({redirectTo:'/'});

}]);


angular.module('grbaApp').controller('AppCtrl', ['$scope', '$log', 'i18nNotifications', 'localizedMessages', 'eventService','GRBA_APP_CONFIG', function($scope, $log, i18nNotifications, localizedMessages, eventService,GRBA_APP_CONFIG) {

    $scope.$watch('event', function(newValue, oldValue) {
    var promesa = eventService.getCurrentEvent();
    promesa.then(function(value) {
        $scope.currentEvent = value;
    }, function(reason) {
        $scope.error = reason;
    });

    var eventDetails = eventService.getEventDetails();
    eventDetails.then(function(value) {
      var now = moment();
      var earlyBirdDate = moment(value.earlyBird.date,GRBA_APP_CONFIG.dateTimeFormat);
      if(now.isSameOrBefore(earlyBirdDate)){
        value.applicableFee=value.earlyBird.fee;
      }else{
        value.applicableFee=value.afterEarlyBird.fee;
      }
        $scope.eventDetails = value;
    }, function(reason) {
        $scope.error = reason;
    });

    var foodItems = eventService.getFoodItems();
    foodItems.then(function(value) {
      var now = moment();
        $scope.foodItems = value;
    }, function(reason) {
        $scope.error = reason;
    });
    
    var registrationDetails = eventService.getRegistrationDetails();
    registrationDetails.then(function(value) {
        $scope.registrationDetails = value;
    }, function(reason) {
        $scope.error = reason;
    });

 });
  //$scope.currentEvent = eventService.getCurrentEvent();
  $log.info($scope);
  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}]);
