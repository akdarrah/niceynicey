(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<',
      parentTask: '<',
      showForm: '<'
    }
  });

  TaskController.$inject = ['$scope', '$http', '$window', 'taskFactory'];

  function TaskController($scope, $http, $window, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTask = completeTask;
    vm.removeTask = removeTask;
    vm.toggleForm = toggleForm;
    vm.allowChildAddition = allowChildAddition;

    vm.showForm = false;
    vm.task = null;
    vm.parentTask = null;

    vm.listStyle = {
      'background': chroma.random()
    }

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var createTask = vm.factory.createTask(label, vm.task.id);

      createTask.then(function(response){
        vm.task.children.unshift(response.data);
        vm.todoText = '';
        vm.showForm = false;
      });
    }

    function completeTask(task){
      var completeTask = vm.factory.completeTask(task.id);

      completeTask.then(function(response){
        vm.task = response.data;
      });
    }

    function removeTask(task){
      if ($window.confirm("Are you sure?")){
        vm.factory.destroyTask(task.id);
        vm.task = null;
      }
    }

    function toggleForm(){
      vm.showForm = !vm.showForm;
    }

    function allowChildAddition(){
      return (!vm.parentTask && vm.task.state == 'pending') ||
        (vm.parentTask && vm.parentTask.state == 'pending');
    }

  }

})();
