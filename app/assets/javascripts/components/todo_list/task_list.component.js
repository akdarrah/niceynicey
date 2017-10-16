(function() {
  'use strict';

  angular.module('taskList', []).component('taskList', {
    templateUrl: 'components/todo_list/task_list.html',
    controller: TaskListController,
    bindings: {
      tasks: '<',
      parentTask: '<'
    }
  });

  TaskListController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskListController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTodo = completeTodo;
    vm.removeTodo = removeTodo;
    vm.enableForm = enableForm;
    vm.disableForm = disableForm;

    vm.showForm = false;
    vm.tasks = [];
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
