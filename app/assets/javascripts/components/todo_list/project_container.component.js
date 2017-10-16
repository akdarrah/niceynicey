(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<'
    }
  });

  ProjectContainerController.$inject = ['$scope', '$http', 'taskFactory'];

  function ProjectContainerController($scope, $http, taskFactory){
    var vm = this;
    vm.factory = taskFactory;

    vm.handleSubmit = handleSubmit;

    vm.tasks = [];

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var createTask = vm.factory.createTask(label, null);

      createTask.then(function(response){
        vm.tasks.push(response.data);
        vm.todoText = '';
        vm.showForm = false;
      });
    }

  }

})();
