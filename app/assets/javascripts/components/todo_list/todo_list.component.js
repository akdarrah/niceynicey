(function() {
  'use strict';

  angular.module('todoList', []).component('todoList', {
    templateUrl: 'components/todo_list/todo_list.html',
    controller: TodoListController,
    bindings: {
      todos: '<'
    }
  });

  TodoListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TodoListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTodo = removeTodo;

    vm.todos = [];
    vm.completedTodos = [];

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;

      var createTask = vm.factory.createTask(label);
      createTask.then(function(response){
        vm.todos.push(response.data);
        vm.todoText = '';
      });
    }

    function completeTodo(todo){
      vm.todos.splice(vm.todos.indexOf(todo), 1);
      vm.completedTodos.push(todo);
    }

    function removeTodo(todo){
      vm.factory.destroyTask(todo.id);
      vm.todos.splice(vm.todos.indexOf(todo), 1);
    }

  }

})();
