(function() {
  'use strict';

  angular.module('taskShow', []).component('taskShow', {
    templateUrl: 'components/todo_list/task_show.html',
    controller: TaskShowController,
    bindings: {
      task: '<'
    }
  });

  TaskShowController.$inject = ['$scope', '$http', 'taskFactory'];

  function TaskShowController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.aceLoaded = aceLoaded;
    vm.aceChanged = aceChanged;

    vm.task = null;

    ///////////////////////////////

    function aceLoaded(_editor) {
    };

    function aceChanged(e) {
      console.log(e);
    };

  }

})();
