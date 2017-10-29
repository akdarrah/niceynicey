(function() {
  'use strict';

  angular
    .module('taskFactory', [])
    .factory('taskFactory', taskFactory);

  taskFactory.$inject = ['$http'];

  function taskFactory($http) {
    return {
      getTasks     : getTasks,
      createTask   : createTask,
      updateTask   : updateTask,
      destroyTask  : destroyTask,
      completeTask : completeTask
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

    function createTask(label, parentId) {
      return $http
        .post('/api/tasks.json', {label: label, parent_id: parentId, position: 1})
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Creating Task Failed: ', response);
        return response;
      }
    }

    function updateTask(task) {
      var params = {
        label: task.label,
        notes: task.notes,
        position: task.position
      };

      return $http
        .patch('/api/tasks/' + task.id + '.json', params)
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

    function completeTask(taskID) {
      return $http
        .post('/api/tasks/' + taskID + '/complete')
        .then(getComplete, getFailed);

      function getComplete(response) {
        return response;
      }

      function getFailed(response) {
        console.info('Completing Task Failed: ', response);
        return response;
      }
    }

  }
})();
