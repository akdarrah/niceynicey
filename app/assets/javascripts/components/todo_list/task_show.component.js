(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      taskId: '@'
    }
  });

  TaskShowController.$inject = ['$scope', '$http', '$sce', 'taskFactory'];

  function TaskShowController($scope, $http, $sce, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.aceLoaded = aceLoaded;
    vm.aceChanged = aceChanged;
    vm.buttonClicked = buttonClicked;
    vm.notesHTML = notesHTML;
    vm.$onInit = onInit;

    vm.readOnly = false;
    vm.taskId = null;
    vm.task = null;
    vm.aceSession = null;
    vm.titleStyle = {};
    vm.parentLinkStyle = {};

    ///////////////////////////////

    function aceLoaded(_editor) {
      vm.aceSession = _editor.getSession();
      _editor.setReadOnly(vm.readOnly);
    };

    function aceChanged(e) {
      vm.task.notes = vm.aceSession.getDocument().getValue();
    };

    function buttonClicked(){
      var updateTask = vm.factory.updateTask(vm.task);

      updateTask.then(function(response){
        vm.task = response.data;
      });
    }

    function notesHTML(){
      return $sce.trustAsHtml(vm.task.rendered_notes);
    }

    function onInit(){
      var getTask = vm.factory.getTask(vm.taskId);

      getTask.then(function(response){
        vm.task = response.data;

        vm.readOnly = vm.task.checkpoint_id != null;

        if(vm.task.notes){
          vm.aceSession.getDocument().setValue(vm.task.notes);
        }

        vm.titleStyle = {
          'background': vm.task.color_hex
        }

        if(vm.task.parent){
          vm.parentLinkStyle = {
            'background': vm.task.parent.color_hex
          }
        }
      });
    }

  }

})();
