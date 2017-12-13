(function() {
  'use strict';

  angular.module('taskList', []).component('taskList', {
    templateUrl: 'components/todo_list/task_list.html',
    controller: TaskListController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      readOnly: '=',
      topLevel: '='
    }
  });

  TaskListController.$inject = ['$rootScope', '$scope', '$http', 'taskFactory'];

  function TaskListController($rootScope, $scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.sortableOptions = {
      cursor: "move",
      handle: ".reorder-icon",
      connectWith: ".task-sortable-ul",
      update: function(event, ui) {
        var task = ui.item.sortable.model;
        var position = (ui.item.sortable.dropindex + 1);
        var parentTask = ui.item.sortable.droptarget.scope().$ctrl.parentTask;

        if(vm.parentTask !== parentTask){
          return false;
        }

        task.parent_id = (parentTask ? parentTask.id : null);
        task.parent = parentTask;
        task.position = position;

        var updateTask = vm.factory.updateTask(task);

        updateTask.then(function(response){
          task = response.data;
        });
      },
    };

    vm.listStyle = {};
    vm.tasks = [];
    vm.parentTask = null;
    vm.readOnly = false;
    vm.showForm = false;

    vm.enableSortable = enableSortable;
    vm.todoTextKeyup = todoTextKeyup;
    vm.handleSubmit = handleSubmit;
    vm.$onInit = onInit;

    $rootScope.$on('toggleTaskForm', function(event, parentTask){
      $rootScope.$broadcast('closeOtherTaskForms', vm.parentTask);

      if(vm.parentTask === parentTask){
        vm.showForm = !vm.showForm;
      } else {
        vm.showForm = false;
      }

      // https://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
      if(vm.showForm){
        setTimeout(function(){
          angular.element('.task-text-input').trigger('focus');
        }, 1);
      }
    });

    ///////////////////////////////

    function onInit(){
      if(vm.parentTask && !vm.topLevel){
        var colorHex = vm.parentTask.child_color_hex;
        var borderColor = chroma(colorHex).darken().saturate(1).hex();

        vm.listStyle = {
          'border-left': "5px solid " + borderColor
        }
      }
    }

    function handleSubmit(){
      var label = vm.todoText;
      var createTask = vm.factory.createTask(label, vm.parentTask.id);

      createTask.then(function(response){
        vm.tasks.unshift(response.data);
        vm.todoText = '';
        vm.showForm = false;
      });
    }

    function todoTextKeyup(event){
      if(event.keyCode == 27){
        vm.showForm = false;
      }
    }

    function enableSortable(){
      return vm.parentTask && vm.parentTask.state !== 'completed';
    }

  }

})();
