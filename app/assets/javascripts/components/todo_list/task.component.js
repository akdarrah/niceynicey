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

  TaskController.$inject = ['$rootScope', '$scope', '$http', '$window', 'taskFactory', 'colorFactory'];

  function TaskController($rootScope, $scope, $http, $window, taskFactory, colorFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.colorFactory = colorFactory;

    vm.completeTask = completeTask;
    vm.toggleForm = toggleForm;
    vm.allowChildAddition = allowChildAddition;
    vm.$onInit = onInit;

    vm.readOnly = false;
    vm.showForm = false;
    vm.task = null;
    vm.parentTask = null;
    vm.listStyle = {};

    $rootScope.$on('taskSortableUpdate', function(event, task){
      if(vm.task.id === task.id){
        vm.task = task;
        setListStyle();
      }
    });

    ///////////////////////////////

    function completeTask(task){
      var completeTask = vm.factory.completeTask(task.id);

      completeTask.then(function(response){
        angular.extend(vm.task, response.data);
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
      var colorHex = vm.task.color_hex;
      vm.listStyle = {};

      if(vm.task.state == "completed"){
        var backgroundColor = vm.colorFactory.getDarkenedColor(colorHex);

        vm.listStyle.background = backgroundColor;
        vm.listStyle.color = vm.colorFactory.getTextColor(backgroundColor);
      } else if(vm.topLevel){
        vm.listStyle.background = colorHex;
        vm.listStyle.color = vm.colorFactory.getTextColor(colorHex);
      }
    }

  }

})();
