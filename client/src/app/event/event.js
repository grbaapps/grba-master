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
    
});