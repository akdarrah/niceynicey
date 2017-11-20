(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      tasksIndex: '='
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

    vm.tasks = [];
    vm.parentTask = null;
    vm.tasksIndex = false;

    vm.$onInit = onInit;

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var parentTaskId = (vm.parentTask ? vm.parentTask.id : null);
      var createTask = vm.factory.createTask(label, parentTaskId);

      createTask.then(function(response){
        vm.tasks.unshift(response.data);
        vm.todoText = '';
        vm.showForm = false;
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

  }

})();
