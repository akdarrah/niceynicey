(function() {
  'use strict';

  angular.module('checkpointList', []).component('checkpointList', {
    templateUrl: 'components/todo_list/checkpoint_list.html',
    controller: checkpointListController,
    bindings: {}
  });

  checkpointListController.$inject = ['$scope', '$http', 'checkpointFactory'];

  function checkpointListController($scope, $http, checkpointFactory){
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
