(function() {
  'use strict';

  angular.module('checkpointShow', []).component('checkpointShow', {
    templateUrl: 'components/todo_list/checkpoint_show.html',
    controller: CheckpointShowController,
    bindings: {
      checkpointId: '@'
    }
  });

  CheckpointShowController.$inject = ['$scope', '$http', 'checkpointFactory'];

  function CheckpointShowController($scope, $http, checkpointFactory){
    var vm = this;
    vm.factory = checkpointFactory;

    vm.$onInit = onInit;

    vm.checkpointId = null;
    vm.checkpoint = null;

    ///////////////////////////////

    function onInit(){
      var getCheckpoint = vm.factory.getCheckpoint(vm.checkpointId);

      getCheckpoint.then(function(response){
        vm.checkpoint = response.data;
      });
    }

  }

})();
