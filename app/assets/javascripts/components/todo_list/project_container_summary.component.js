(function() {
  'use strict';

  angular.module('projectContainerSummary', []).component('projectContainerSummary', {
    templateUrl: 'components/todo_list/project_container_summary.html',
    controller: ProjectContainerSummaryController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      tasksIndex: '=',
      readOnly: '='
    }
  });

  ProjectContainerSummaryController.$inject = ['$scope', '$http', 'taskFactory', 'checkpointFactory'];

  function ProjectContainerSummaryController($scope, $http, taskFactory, checkpointFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.checkpointFactory = checkpointFactory;

    vm.quote = gon.quote;

    vm.loading = false;
    vm.tasks = [];
    vm.parentTask = null;

    ///////////////////////////////

  }

})();
