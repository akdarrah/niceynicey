(function() {
  'use strict';

  angular.module('taskList', []).component('taskList', {
    templateUrl: 'components/todo_list/task_list.html',
    controller: TaskListController,
    bindings: {
      tasks: '<',
      parentTask: '<'
    }
  });

  TaskListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.sortableOptions = {
      cursor: "move",
      handle: ".reorder-icon",
      items: '.sortable-item',
      stop: function(event, ui) {
        console.log(ui.item.sortable.model);
      },
    };

    vm.listStyle = {};
    vm.tasks = [];
    vm.parentTask = null;

    vm.$onInit = onInit;

    ///////////////////////////////

    function onInit(){
      if(vm.tasks.length && vm.parentTask){
        var colorHex = vm.tasks[0].color_hex;
        var borderColor = chroma(colorHex).darken().saturate(1).hex();

        vm.listStyle = {
          'border-left': "5px solid " + borderColor
        }
      }
    }

  }

})();
