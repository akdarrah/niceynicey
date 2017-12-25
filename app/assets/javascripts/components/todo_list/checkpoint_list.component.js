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

  }

})();
