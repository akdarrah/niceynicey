(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<',
      parentTask: '<',
      showForm: '<',
      readOnly: '='
    }
  });

  TaskController.$inject = ['$scope', '$http', '$window', 'taskFactory'];

  function TaskController($scope, $http, $window, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;
    vm.completeTask = completeTask;
    vm.toggleForm = toggleForm;
    vm.allowChildAddition = allowChildAddition;
    vm.$onInit = onInit;

    vm.readOnly = false;
    vm.showForm = false;
    vm.task = null;
    vm.parentTask = null;
    vm.listStyle = {};

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

    function toggleForm(){
      vm.showForm = !vm.showForm;
    }

    function allowChildAddition(){
      return vm.task.state == 'pending';
    }

    function onInit(){
      var backgroundColor = vm.task.color_hex;
      var borderColor = chroma(vm.task.color_hex).darken().saturate(1).hex();

      vm.listStyle = {};

      if(vm.task.state == "completed"){
        vm.listStyle['opacity'] = "0.8";
      }

      if(!vm.parentTask){
        vm.listStyle['border-left'] = "5px solid " + borderColor;
        vm.listStyle['background'] = backgroundColor;
      }
    }

  }

})();
