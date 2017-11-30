(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      tasksIndex: '=',
      readOnly: '='
    }
  });

  ProjectContainerController.$inject = ['$scope', '$http', 'taskFactory', 'checkpointFactory'];

  function ProjectContainerController($scope, $http, taskFactory, checkpointFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.checkpointFactory = checkpointFactory;

    vm.handleSubmit = handleSubmit;
    vm.placeHolderText = placeHolderText;
    vm.createCheckpoint = createCheckpoint;
    vm.showForm = showForm;
    vm.completedTaskCount = completedTaskCount;

    vm.tasks = [];
    vm.parentTask = null;
    vm.tasksIndex = false;
    vm.readOnly = false;

    vm.$onInit = onInit;

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var parentTaskId = (vm.parentTask ? vm.parentTask.id : null);
      var createTask = vm.factory.createTask(label, parentTaskId);

      createTask.then(function(response){
        vm.tasks.unshift(response.data);
        vm.todoText = '';
      });
    }

    function placeHolderText(){
      if(vm.parentTask){
        return "Add task to " + vm.parentTask.label;
      } else {
        return "Add Project";
      }
    }

    function onInit(){
      if(vm.tasksIndex){
        getTasks();
      }
    }

    function createCheckpoint(){
      var createCheckpoint = vm.checkpointFactory.createCheckpoint();

      createCheckpoint.then(function(response){
        getTasks();
      });
    }

    function getTasks(){
      var getTasks = vm.factory.getTasks();

      getTasks.then(function(response){
        vm.tasks = response.data;
      });
    }

    function showForm(){
      return !vm.readOnly && (!vm.parentTask || vm.parentTask.state == 'pending')
    }

    function completedTaskCount(tasks){
      var parentTasks = tasks || vm.tasks || [];

      var completedCount = parentTasks.map(function(task){
        return (task.state == "completed" ? 1 : 0);
      }).reduce(function(sum, number){
        return sum + number;
      }, 0);

      var completedChildrenCount = parentTasks.map(function(task){
        return completedTaskCount(task.children);
      }).reduce(function(sum, number){
        return sum + number;
      }, 0);

      return completedCount + completedChildrenCount;
    }

  }

})();
