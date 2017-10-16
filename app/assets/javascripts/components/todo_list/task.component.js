(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<'
    }
  });

  TaskController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTodo = removeTodo;
    vm.enableForm = enableForm;
    vm.disableForm = disableForm;

    vm.task = null;
    vm.todos = [];
    vm.parentTask = null;

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var parentId = (vm.parentTask ? vm.parentTask.id : null);
      var createTask = vm.factory.createTask(label, parentId);

      createTask.then(function(response){
        vm.todos.push(response.data);
        vm.todoText = '';
        vm.showForm = false;
      });
    }

    function completeTodo(todo){
      var completeTask = vm.factory.completeTask(todo.id);

      completeTask.then(function(){
        vm.todos.splice(vm.todos.indexOf(todo), 1);
      });
    }

    function removeTodo(todo){
      vm.factory.destroyTask(todo.id);
      vm.todos.splice(vm.todos.indexOf(todo), 1);
    }

    function enableForm(){
      vm.showForm = true;
    }

    function disableForm(){
      vm.showForm = false;
    }

  }

})();
