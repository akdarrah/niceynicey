(function() {
  'use strict';

  angular.module('todoList', []).component('todoList', {
    templateUrl: 'components/todo_list/todo_list.html',
    controller: TodoListController
  });

  TodoListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TodoListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    var getTasks = vm.factory.getTasks();
    getTasks.then(handleGetTasksResponse);

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTodo = removeTodo;

    vm.todos = [];
    vm.completedTodos = [];

    ///////////////////////////////

    function handleSubmit(){
      vm.todos.push(vm.todoText);

      vm.todoText = '';
    }

    function completeTodo(todo){
      vm.todos.splice(vm.todos.indexOf(todo), 1);
      vm.completedTodos.push(todo);
    }

    function removeTodo(todo){
      vm.todos.splice(vm.todos.indexOf(todo), 1);
    }

    function handleGetTasksResponse(response) {
      console.log(response);
    }

  }

})();
