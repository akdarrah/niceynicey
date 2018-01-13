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

    vm.$onInit = onInit;

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


        var projectIdsToExtend = currentProjectIds();

        var getCurrentTasks = vm.taskFactory.getTasks();
        getCurrentTasks.then(function(response){
          vm.currentTasks = response.data;

          vm.currentTasks.forEach(function(task){
            task.extended = contains.call(projectIdsToExtend, task.id);
          });
        });

      });
    }

    function currentProjectIds(){
      return vm.tasks.map(function(task){
        return task.copied_from_task_id;
      });
    }

    // https://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
    var contains = function(needle) {
      // Per spec, the way to identify NaN is that it is not equal to itself
      var findNaN = needle !== needle;
      var indexOf;

      if(!findNaN && typeof Array.prototype.indexOf === 'function') {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function(needle) {
              var i = -1, index = -1;

              for(i = 0; i < this.length; i++) {
                  var item = this[i];

                  if((findNaN && item !== item) || item === needle) {
                      index = i;
                      break;
                  }
              }

              return index;
          };
      }

      return indexOf.call(this, needle) > -1;
    };

  }

})();
