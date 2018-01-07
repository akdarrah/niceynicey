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
    vm.retractChildren = retractChildren;
    vm.extendChildren = extendChildren;

    vm.task = null;
    vm.backgroundColor = null;
    vm.parentTask = null;
    vm.listStyle = {};
    vm.taskLinkStyle = {};

    ///////////////////////////////

    function onInit(){
      setListStyle();

      vm.task.extended = vm.task.state !== "completed" ||
        (vm.task.state === "completed" && !vm.task.children.length);
    }

    function retractChildren(){
      vm.task.extended = false;
    }

    function extendChildren(){
      vm.task.extended = true;
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
