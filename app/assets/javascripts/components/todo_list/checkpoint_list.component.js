(function() {
  'use strict';

  angular.module('checkpointList', []).component('checkpointList', {
    templateUrl: 'components/todo_list/checkpoint_list.html',
    controller: CheckpointListController,
    bindings: {}
  });

  CheckpointListController.$inject = ['$scope', '$http', 'checkpointFactory'];

  function CheckpointListController($scope, $http, checkpointFactory){
    var vm = this;
    vm.factory = checkpointFactory;

    vm.$onInit = onInit;

    vm.checkpoints = null;

    ///////////////////////////////

    function onInit(){
      var getCheckpoints = vm.factory.getCheckpoints();

      getCheckpoints.then(function(response){
        vm.checkpoints = response.data;
      });
    }

  }

})();
