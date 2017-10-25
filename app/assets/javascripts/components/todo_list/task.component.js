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

  TaskController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTask = removeTask;
    vm.toggleForm = toggleForm;

    vm.showForm = false;
    vm.task = null;
    vm.parentTask = null;

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

    function completeTodo(todo){
      var completeTask = vm.factory.completeTask(todo.id);

      completeTask.then(function(){
        vm.tasks.splice(vm.tasks.indexOf(todo), 1);
      });
    }

    function removeTask(task){
      vm.factory.destroyTask(task.id);
      vm.task = null;
    }

    function toggleForm(){
      vm.showForm = !vm.showForm;
    }

  }

})();
