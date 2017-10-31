(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      task: '<'
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

    vm.task = null;
    vm.aceSession = null;

    ///////////////////////////////

    function aceLoaded(_editor) {
      vm.aceSession = _editor.getSession();

      if(vm.task.notes){
        vm.aceSession.getDocument().setValue(vm.task.notes);
      }
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

  }

})();
