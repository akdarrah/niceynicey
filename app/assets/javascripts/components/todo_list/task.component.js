(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<',
      parentTask: '<',
      showForm: '<',
      readOnly: '=',
      topLevel: '='
    }
  });

  TaskController.$inject = ['$rootScope', '$scope', '$http', '$window', 'taskFactory'];

  function TaskController($rootScope, $scope, $http, $window, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

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

    function completeTask(task){
      var completeTask = vm.factory.completeTask(task.id);

      completeTask.then(function(response){
        vm.task = response.data;
        setListStyle();
      });
    }

    function toggleForm(){
      $rootScope.$broadcast('toggleTaskForm', vm.task);
    }

    function allowChildAddition(){
      return vm.task.state == 'pending';
    }

    function onInit(){
      setListStyle();
    }

    function setListStyle(){
      var backgroundColor = vm.task.color_hex;
      var completedBackgroundColor = chroma(vm.task.color_hex).darken().saturate(1).hex();

      vm.listStyle = {};

      if(vm.task.state == "completed"){
        vm.listStyle['background'] = completedBackgroundColor;
      } else if(vm.topLevel){
        vm.listStyle['background'] = backgroundColor;
      }
    }

  }

})();
