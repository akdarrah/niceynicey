(function() {
  'use strict';

  angular.module('todoList', []).component('todoList', {
    templateUrl: 'components/todo_list/todo_list.html',
    controller: TodoListController
  });

  function TodoListController(){
    var vm = this;

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

  }

})();
