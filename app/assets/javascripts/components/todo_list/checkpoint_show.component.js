(function() {
  'use strict';

  angular.module('checkpointShow', []).component('checkpointShow', {
    templateUrl: 'components/todo_list/checkpoint_show.html',
    controller: CheckpointShowController,
    bindings: {
      checkpointId: '@'
    }
  });

  CheckpointShowController.$inject = ['$scope', '$http', 'checkpointFactory', 'taskFactory'];

  function CheckpointShowController($scope, $http, checkpointFactory, taskFactory){
    var vm = this;
    vm.factory = checkpointFactory;
    vm.taskFactory = taskFactory;

    vm.showCurrentProjects = showCurrentProjects;
    vm.$onInit = onInit;

    vm.showCurrent = false;
    vm.currentTasks = [];
    vm.loading = false;
    vm.checkpointId = null;
    vm.checkpoint = null;
    vm.tasks = [];

    ///////////////////////////////

    function onInit(){
      vm.loading = true;

      var getCheckpoint = vm.factory.getCheckpoint(vm.checkpointId);
      getCheckpoint.then(function(response){
        vm.checkpoint = response.data;
      });

      var getCheckpointTasks = vm.taskFactory.getCheckpointTasks(vm.checkpointId);
      getCheckpointTasks.then(function(response){
        vm.tasks = response.data;
        vm.loading = false;
      });
    }

    function showCurrentProjects(){
      vm.showCurrent = true;

      var getCurrentTasks = vm.taskFactory.getTasks();
      getCurrentTasks.then(function(response){
        vm.currentTasks = response.data;
      });
    }

  }

})();
