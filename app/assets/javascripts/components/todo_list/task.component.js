(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<',
      parentTask: '<',
      showForm: '<',
      topLevel: '=',
      backgroundColor: '<'
    }
  });

  TaskController.$inject = ['$rootScope', '$scope', '$http', '$window', 'taskFactory', 'colorFactory'];

  function TaskController($rootScope, $scope, $http, $window, taskFactory, colorFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.colorFactory = colorFactory;

    vm.disableReopenButton = disableReopenButton;
    vm.showPinned = showPinned;
    vm.showCompleteButton = showCompleteButton;
    vm.showReopenButton = showReopenButton;
    vm.completeTask = completeTask;
    vm.reopenTask = reopenTask;
    vm.toggleForm = toggleForm;
    vm.allowChildAddition = allowChildAddition;
    vm.retractChildren = retractChildren;
    vm.extendChildren = extendChildren;
    vm.$onInit = onInit;

    vm.showForm = false;
    vm.task = null;
    vm.backgroundColor = null;
    vm.parentTask = null;
    vm.listStyle = {};
    vm.taskLinkStyle = {};

    $rootScope.$on('taskSortableUpdate', function(event, task){
      if(vm.task.id === task.id){
        vm.task = task;
        setListStyle();
      }
    });

    ///////////////////////////////

    function showPinned(){
      return vm.task.pinned;
    }

    function showCompleteButton(){
      return !vm.task.pinned && vm.task.state == 'pending';
    }

    function showReopenButton(){
      return !vm.task.pinned && vm.task.state == 'completed';
    }

    function disableReopenButton(){
      return vm.parentTask && vm.parentTask.state == 'completed';
    }

    function completeTask(task){
      var completeTask = vm.factory.completeTask(task.id);

      completeTask.then(function(response){
        angular.extend(vm.task, response.data);
        setListStyle();
        $scope.$emit("taskCompleted");
      });
    }

    function reopenTask(task){
      var reopenTask = vm.factory.reopenTask(task.id);

      reopenTask.then(function(response){
        angular.extend(vm.task, response.data);
        setListStyle();
        $scope.$emit("taskReopened");
      });
    }

    function toggleForm(){
      extendChildren();
      $rootScope.$broadcast('toggleTaskForm', vm.task);
    }

    function allowChildAddition(){
      return vm.task.state == 'pending';
    }

    function retractChildren(){
      vm.task.extended = false;

      var updateTask = vm.factory.updateTask(vm.task);
      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
      });
    }

    function extendChildren(){
      vm.task.extended = true;

      var updateTask = vm.factory.updateTask(vm.task);
      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
      });
    }

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
