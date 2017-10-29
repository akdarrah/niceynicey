(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<',
      parentTask: '<'
    }
  });

  ProjectContainerController.$inject = ['$scope', '$http', 'taskFactory'];

  function ProjectContainerController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;

    vm.tasks = [];
    vm.parentTask = null;

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var parentTaskId = (vm.parentTask ? vm.parentTask.id : null);
      var createTask = vm.factory.createTask(label, parentTaskId);

      createTask.then(function(response){
        vm.tasks.unshift(response.data);
        vm.todoText = '';
        vm.showForm = false;
      });
    }

  }

})();
