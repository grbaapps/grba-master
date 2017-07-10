/*! grbaApp - v0.0.1-SNAPSHOT - 2017-05-12
 * https://github.com/angular-app/angular-app
 * Copyright (c) 2017 Surajit Pal/Abhishek Ghosh;
 * Licensed MIT
 */
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
        templateUrl : "html/home.html"
    })
    .when("/event", {
        templateUrl : "html/event.html"
    })
    .when("/about", {
        templateUrl : "html/about.html"
    })
    .when("/contact", {
        templateUrl : "html/contact.html"
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

angular.module('contact', []).controller('contactController', ['$scope', '$http', '$resource', '$log', function ($scope, $http, $resource, $log) {
    
    $scope.submit = function () {
        alert("This feature is coming soon. Please click on the link info@grbaonline.org for now.");
    };

    $scope.reset = function () {
        
    };

}]);
angular.module('event',[]).service('eventService', function($http, $log, $q) {

    this.getCurrentEvent =  function() {
         var deferred = $q.defer();
        $http.get('/api/currentEvent')
            .success(function(data) {

                //this.currentEvent = data;
                deferred.resolve(data);
                //$log.info(data);

            });

        return deferred.promise;
    };

    this.getEventDetails =  function() {
         var deferred = $q.defer();
        $http.get('/api/eventDetails')
            .success(function(data) {

                //this.currentEvent = data;
                deferred.resolve(data);
                //$log.info(data);

            });

        return deferred.promise;
    };

    this.getFoodItems =  function() {
         var deferred = $q.defer();
        $http.get('/api/eventDetails')
            .success(function(data) {

                //this.currentEvent = data;
                deferred.resolve(data);
                //$log.info(data);

            });

        return deferred.promise;
    };
    
     this.getRegistrationDetails =  function() {
         var deferred = $q.defer();
        $http.get('/api/registration/year/2017/event/AP')
            .success(function(data) {

                //this.currentEvent = data;
                deferred.resolve(data);
                //$log.info(data);

            });

        return deferred.promise;
    };

});

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
                    isVegiterian: $scope.isVegiterian,
                    noOfAdults: Number($scope.noOfAdults),
                    noOfChildren: Number($scope.noOfChildren),
                    eventFee: $scope.eventFee,
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
angular.module('services.exceptionHandler', ['services.i18nNotifications']);

angular.module('services.exceptionHandler').factory('exceptionHandlerFactory', ['$injector', function($injector) {
  return function($delegate) {

    return function (exception, cause) {
      // Lazy load notifications to get around circular dependency
      //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
      var i18nNotifications = $injector.get('i18nNotifications');

      // Pass through to original handler
      $delegate(exception, cause);

      // Push a notification error
      i18nNotifications.pushForCurrentRoute('error.fatal', 'error', {}, {
        exception:exception,
        cause:cause
      });
    };
  };
}]);

angular.module('services.exceptionHandler').config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
    return exceptionHandlerFactory($delegate);
  }]);
}]);

angular.module('services.i18nNotifications', ['services.notifications', 'services.localizedMessages']);
angular.module('services.i18nNotifications').factory('i18nNotifications', ['localizedMessages', 'notifications', function (localizedMessages, notifications) {

  var prepareNotification = function(msgKey, type, interpolateParams, otherProperties) {
     return angular.extend({
       message: localizedMessages.get(msgKey, interpolateParams),
       type: type
     }, otherProperties);
  };

  var I18nNotifications = {
    pushSticky:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushSticky(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForCurrentRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForCurrentRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForNextRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForNextRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    getCurrent:function () {
      return notifications.getCurrent();
    },
    remove:function (notification) {
      return notifications.remove(notification);
    }
  };

  return I18nNotifications;
}]);
angular.module('services.localizedMessages', []).factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', function ($interpolate, i18nmessages) {

  var handleNotFound = function (msg, msgKey) {
    return msg || '?' + msgKey + '?';
  };

  return {
    get : function (msgKey, interpolateParams) {
      var msg =  i18nmessages[msgKey];
      if (msg) {
        return $interpolate(msg)(interpolateParams);
      } else {
        return handleNotFound(msg, msgKey);
      }
    }
  };
}]);
angular.module('services.notifications', []).factory('notifications', ['$rootScope', function ($rootScope) {

  var notifications = {
    'STICKY' : [],
    'ROUTE_CURRENT' : [],
    'ROUTE_NEXT' : []
  };
  var notificationsService = {};

  var addNotification = function (notificationsArray, notificationObj) {
    if (!angular.isObject(notificationObj)) {
      throw new Error("Only object can be added to the notification service");
    }
    notificationsArray.push(notificationObj);
    return notificationObj;
  };

  $rootScope.$on('$routeChangeSuccess', function () {
    notifications.ROUTE_CURRENT.length = 0;

    notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
    notifications.ROUTE_NEXT.length = 0;
  });

  notificationsService.getCurrent = function(){
    return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
  };

  notificationsService.pushSticky = function(notification) {
    return addNotification(notifications.STICKY, notification);
  };

  notificationsService.pushForCurrentRoute = function(notification) {
    return addNotification(notifications.ROUTE_CURRENT, notification);
  };

  notificationsService.pushForNextRoute = function(notification) {
    return addNotification(notifications.ROUTE_NEXT, notification);
  };

  notificationsService.remove = function(notification){
    angular.forEach(notifications, function (notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx>-1){
        notificationsByType.splice(idx,1);
      }
    });
  };

  notificationsService.removeAll = function(){
    angular.forEach(notifications, function (notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  return notificationsService;
}]);
angular.module('templates.app', []);


angular.module('templates.common', []);

