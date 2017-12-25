(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      taskId: '@'
    }
  });

  TaskShowController.$inject = ['$scope', '$http', '$sce', 'taskFactory', 'colorFactory'];

  function TaskShowController($scope, $http, $sce, taskFactory, colorFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.colorFactory = colorFactory;

    vm.updateTask = updateTask;
    vm.showChildren = showChildren;
    vm.toggleEditMode = toggleEditMode;
    vm.$onInit = onInit;

    vm.loading = false;
    vm.editMode = false;
    vm.readOnly = false;
    vm.taskId = null;
    vm.task = null;
    vm.titleStyle = {};
    vm.parentLinkStyle = {};

    $scope.$on('checkpointCreated', function(){
      getTaskData();
    });

    ///////////////////////////////

    function showChildren(){
      return vm.task && (vm.task.children.length || vm.task.state == 'pending');
    }

    function onInit(){
      getTaskData();
    }

    function getTaskData(){
      vm.loading = true;
      var getTask = vm.factory.getTask(vm.taskId);

      getTask.then(function(response){
        vm.task = response.data;
        vm.readOnly = vm.task.checkpoint_id != null;

        setStyles();
        vm.loading = false;
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
        'background': vm.task.color_hex,
        'color': vm.colorFactory.getTextColor(vm.task.color_hex)
      };

      if(vm.task.parent){
        vm.parentLinkStyle = {
          'background': vm.task.parent.color_hex,
          'color': vm.colorFactory.getTextColor(vm.task.parent.color_hex)
        };
      }
    }

  }

})();
