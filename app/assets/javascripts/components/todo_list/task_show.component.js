(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      taskId: '@'
    }
  });

  TaskShowController.$inject = ['$scope', '$http', '$sce', 'taskFactory', 'colorFactory'];

  function TaskShowController($scope, $http, $sce, taskFactory, colorFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.colorFactory = colorFactory;

    vm.suggestedColorHexes = [
      "#e99695",
      "#f9d0c4",
      "#fef2c0",
      "#c2e0c6",
      "#bfdadc",
      "#c5def5",
      "#bfd4f2",
      "#d4c5f9"
    ];

    vm.uniqueId = uniqueId;
    vm.chooseColor = chooseColor;
    vm.colorPickerStyle = colorPickerStyle;
    vm.updateTask = updateTask;
    vm.toggleEditMode = toggleEditMode;
    vm.$onInit = onInit;

    vm.loading = false;
    vm.editMode = false;
    vm.readOnly = false;
    vm.taskId = null;
    vm.task = null;
    vm.titleStyle = {};
    vm.parentLinkStyle = {};

    ///////////////////////////////

    function onInit(){
      getTaskData();
    }

    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uniqueId(){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    function getTaskData(){
      vm.loading = true;
      var getTask = vm.factory.getTask(vm.taskId);

      getTask.then(function(response){
        vm.task = response.data;
        vm.readOnly = vm.task.checkpoint_id != null;

        setStyles();
        vm.loading = false;
      });
    }

    function toggleEditMode(){
      vm.editMode = !vm.editMode;
    }

    function updateTask(){
      if(vm.readOnly){
        return false;
      }

      var updateTask = vm.factory.updateTask(vm.task);

      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
        setStyles();
        vm.editMode = false;
      });
    }

    function setStyles(){
      vm.titleStyle = {
        'background': vm.task.color_hex,
        'color': vm.colorFactory.getTextColor(vm.task.color_hex)
      };

      if(vm.task.parent){
        vm.parentLinkStyle = {
          'background': vm.task.parent.color_hex,
          'color': vm.colorFactory.getTextColor(vm.task.parent.color_hex)
        };
      }
    }

    function colorPickerStyle(colorHex){
      return {
        background: colorHex
      };
    }

    function chooseColor(colorHex){
      vm.task.color_hex = colorHex;
    }

  }

})();
