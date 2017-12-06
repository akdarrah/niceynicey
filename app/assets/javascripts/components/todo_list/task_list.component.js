(function() {
  'use strict';

  angular.module('taskList', []).component('taskList', {
    templateUrl: 'components/todo_list/task_list.html',
    controller: TaskListController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      readOnly: '='
    }
  });

  TaskListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.sortableOptions = {
      cursor: "move",
      handle: ".reorder-icon",
      connectWith: ".task-sortable-ul",
      update: function(event, ui) {
        var task = ui.item.sortable.model;
        var position = (ui.item.sortable.dropindex + 1);
        var parentTask = ui.item.sortable.droptarget.scope().$ctrl.parentTask;

        task.parent_id = parentTask.id;
        task.parent = parentTask;
        task.position = position;

        var updateTask = vm.factory.updateTask(task);

        updateTask.then(function(response){
          task = response.data;
        });
      },
    };

    vm.listStyle = {};
    vm.tasks = [];
    vm.parentTask = null;
    vm.readOnly = false;

    vm.$onInit = onInit;

    ///////////////////////////////

    function onInit(){
      if(vm.tasks && vm.tasks.length && vm.parentTask){
        var colorHex = vm.tasks[0].color_hex;
        var borderColor = chroma(colorHex).darken().saturate(1).hex();

        vm.listStyle = {
          'border-left': "5px solid " + borderColor
        }
      }
    }

  }

})();
