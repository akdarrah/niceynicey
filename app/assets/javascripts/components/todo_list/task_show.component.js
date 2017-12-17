(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      taskId: '@'
    }
  });

  TaskShowController.$inject = ['$scope', '$http', '$sce', 'taskFactory'];

  function TaskShowController($scope, $http, $sce, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.updateTask = updateTask;
    vm.showChildren = showChildren;
    vm.toggleEditMode = toggleEditMode;
    vm.$onInit = onInit;

    vm.editMode = false;
    vm.readOnly = false;
    vm.taskId = null;
    vm.task = null;
    vm.titleStyle = {};
    vm.parentLinkStyle = {};

    ///////////////////////////////

    function showChildren(){
      return vm.task && (vm.task.children.length || vm.task.state == 'pending');
    }

    function onInit(){
      var getTask = vm.factory.getTask(vm.taskId);

      getTask.then(function(response){
        vm.task = response.data;
        vm.readOnly = vm.task.checkpoint_id != null;

        setStyles();
      });
    }

    function toggleEditMode(){
      vm.editMode = !vm.editMode;
    }

    function updateTask(){
      if(vm.readOnly){
        return false;
      }

      var updateTask = vm.factory.updateTask(vm.task);

      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
        setStyles();
        vm.editMode = false;
      });
    }

    function setStyles(){
      vm.titleStyle = {
        'background': vm.task.color_hex
      };

      if(vm.task.parent){
        vm.parentLinkStyle = {
          'background': vm.task.parent.color_hex
        };
      }
    }

  }

})();
