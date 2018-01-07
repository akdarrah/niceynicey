(function() {
  'use strict';

  angular.module('taskListSummary', []).component('taskListSummary', {
    templateUrl: 'components/todo_list/task_list_summary.html',
    controller: TaskListSummaryController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      topLevel: '=',
      backgroundColor: '<',
      skipExtendedOverride: '='
    }
  });

  TaskListSummaryController.$inject = [];

  function TaskListSummaryController(){
    var vm = this;

    vm.listStyle = {};
    vm.tasks = [];
    vm.parentTask = null;
    vm.backgroundColor = null;
    vm.skipExtendedOverride = false;

    vm.$onInit = onInit;

    ///////////////////////////////

    function onInit(){
      if(vm.parentTask && !vm.topLevel){
        var colorHex = vm.parentTask.child_color_hex;

        vm.listStyle = {
          'border-left': "5px solid " + colorHex
        };
      }
    }

  }

})();
