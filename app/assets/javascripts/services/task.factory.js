(function() {
  'use strict';

  angular
    .module('taskFactory', [])
    .factory('taskFactory', taskFactory);

  taskFactory.$inject = ['$http'];

  function taskFactory($http) {
    return {
      getTasks : getTasks
    };

    /////////////////////////

    function getTasks() {
      return $http
        .get('/tasks')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Fetching Scheduled Export failed: ', response);
        return response;
      }
    }

  }
})();
