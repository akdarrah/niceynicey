(function() {
  'use strict';

  angular.module('checkpointList', []).component('checkpointList', {
    templateUrl: 'components/todo_list/checkpoint_list.html',
    controller: CheckpointListController,
    bindings: {}
  });

  CheckpointListController.$inject = ['$scope', '$http', 'checkpointFactory', 'colorFactory'];

  function CheckpointListController($scope, $http, checkpointFactory, colorFactory){
    var vm = this;
    vm.factory = checkpointFactory;
    vm.colorFactory = colorFactory;

    vm.$onInit = onInit;
    vm.styleProject = styleProject;

    vm.quote = gon.quote;
    vm.loading = false;
    vm.checkpoints = null;

    ///////////////////////////////

    function onInit(){
      vm.loading = true;
      var getCheckpoints = vm.factory.getCheckpoints();

      getCheckpoints.then(function(response){
        vm.checkpoints = response.data;
        vm.loading = false;
      });
    }

    function styleProject(project){
      var style = {};

      style.background = project.color_hex;
      style.color = vm.colorFactory.getTextColor(project.color_hex);

      return style;
    }

  }

})();
