(function() {
  'use strict';

  angular.module('todoList', []).component('todoList', {
    templateUrl: 'components/todo_list/todo_list.html',
    controller: TodoListController,
    bindings: {
      todos: '<',
      parentTask: '<'
    }
  });

  TodoListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TodoListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTodo = removeTodo;
    vm.enableForm = enableForm;
    vm.disableForm = disableForm;

    vm.showForm = false;
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
