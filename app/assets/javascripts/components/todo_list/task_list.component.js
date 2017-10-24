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
      start: function(){ console.log('...'); },
      update: function(e, ui) { console.log('..'); },
      axis: 'y',
      handle: ".reorder-icon"
    };

    vm.tasks = [];
    vm.parentTask = null;

    ///////////////////////////////

  }

})();
