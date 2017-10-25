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

    vm.tasks = [];
    vm.parentTask = null;

    ///////////////////////////////

  }

})();
