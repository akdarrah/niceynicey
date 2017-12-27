(function() {
  'use strict';

  angular.module('taskSummary', []).component('taskSummary', {
    templateUrl: 'components/todo_list/task_summary.html',
    controller: TaskSummaryController,
    bindings: {
      task: '<',
      parentTask: '<',
      topLevel: '=',
      backgroundColor: '<'
    }
  });

  TaskSummaryController.$inject = ['colorFactory'];

  function TaskSummaryController(colorFactory){
    var vm = this;
    vm.colorFactory = colorFactory;

    vm.$onInit = onInit;

    vm.task = null;
    vm.backgroundColor = null;
    vm.parentTask = null;
    vm.listStyle = {};
    vm.taskLinkStyle = {};

    ///////////////////////////////

    function onInit(){
      setListStyle();
    }

    function setListStyle(){
      var colorHex = vm.task.color_hex;
      var textColor;

      vm.listStyle = {};
      vm.taskLinkStyle = {};

      if(vm.task.state == "completed"){
        vm.backgroundColor = colorHex;
        vm.listStyle.background = vm.backgroundColor;
      } else if(vm.topLevel){
        vm.backgroundColor = colorHex;
        vm.listStyle.background = vm.backgroundColor;
      }

      vm.listStyle.color = vm.colorFactory.getTextColor(vm.backgroundColor);
      vm.taskLinkStyle.color = vm.colorFactory.getTextColor(vm.backgroundColor);
    }

  }

})();
