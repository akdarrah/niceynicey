(function() {
  'use strict';

  angular
    .module('checkpointFactory', [])
    .factory('checkpointFactory', checkpointFactory);

  checkpointFactory.$inject = ['$http'];

  function checkpointFactory($http) {
    return {
      getCheckpoint  : getCheckpoint,
      getCheckpoints : getCheckpoints
    };

    /////////////////////////

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

    function getCheckpoints(){
      return $http
        .get('/api/checkpoints.json')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Getting Checkpoints Failed: ', response);
        return response;
      }
    }

  }
})();
