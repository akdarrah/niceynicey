(function() {
  'use strict';

  angular
    .module('taskFactory', [])
    .factory('taskFactory', taskFactory);

  taskFactory.$inject = ['$http'];

  function taskFactory($http) {
    return {
      getTasks    : getTasks,
      createTask  : createTask,
      destroyTask : destroyTask
    };

    /////////////////////////

    function getTasks() {
      return $http
        .get('/api/tasks.json')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Fetching Tasks Failed: ', response);
        return response;
      }
    }

    function createTask(label) {
      return $http
        .post('/api/tasks.json', {label: label})
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Creating Task Failed: ', response);
        return response;
      }
    }

    function destroyTask(taskID) {
      return $http
        .delete('/api/tasks/' + taskID + '.json')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Deleting Task Failed: ', response);
        return response;
      }
    }

  }
})();
