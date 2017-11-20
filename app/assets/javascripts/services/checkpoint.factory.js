(function() {
  'use strict';

  angular
    .module('checkpointFactory', [])
    .factory('checkpointFactory', checkpointFactory);

  checkpointFactory.$inject = ['$http'];

  function checkpointFactory($http) {
    return {
      createCheckpoint : createCheckpoint,
      getCheckpoint    : getCheckpoint
    };

    /////////////////////////

    function createCheckpoint() {
      return $http
        .post('/api/checkpoints.json')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Creating Checkpoint Failed: ', response);
        return response;
      }
    }

    function getCheckpoint(checkpointId){
      return $http
        .get('/api/checkpoints/' + checkpointId + '.json')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Getting Checkpoint Failed: ', response);
        return response;
      }
    }

  }
})();
