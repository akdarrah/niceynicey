(function() {
  'use strict';

  angular.module('task', []).component('task', {
    templateUrl: 'components/todo_list/task.html',
    controller: TaskController,
    bindings: {
      task: '<',
      parentTask: '<',
      showForm: '<',
      topLevel: '=',
      backgroundColor: '<',
      allowExtend: '<',
      allowReorder: '<',
      allowAddChildren: '<',
      showChildren: '<'
    }
  });

  TaskController.$inject = ['$rootScope', '$scope', '$http', '$window', 'taskFactory', 'colorFactory'];

  function TaskController($rootScope, $scope, $http, $window, taskFactory, colorFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.colorFactory = colorFactory;

    vm.primaryButtonClick = primaryButtonClick;
    vm.disablePrimaryButton = disablePrimaryButton;
    vm.primaryButtonIcon = primaryButtonIcon;
    vm.disableReopenButton = disableReopenButton;
    vm.showPinned = showPinned;
    vm.showCompleteButton = showCompleteButton;
    vm.showReopenButton = showReopenButton;
    vm.completeTask = completeTask;
    vm.reopenTask = reopenTask;
    vm.toggleForm = toggleForm;
    vm.allowChildAddition = allowChildAddition;
    vm.retractChildren = retractChildren;
    vm.extendChildren = extendChildren;
    vm.starredClass = starredClass;
    vm.toggleStarred = toggleStarred;
    vm.$onInit = onInit;

    vm.showForm = false;
    vm.task = null;
    vm.backgroundColor = null;
    vm.parentTask = null;
    vm.listStyle = {};
    vm.taskLinkStyle = {};

    $rootScope.$on('taskSortableUpdate', function(event, task){
      if(vm.task.id === task.id){
        vm.task = task;
        setListStyle();
      }
    });

    ///////////////////////////////

    function primaryButtonIcon(){
      if(vm.showPinned()){
        return "fa-lock";
      } else if (vm.showCompleteButton()) {
        return "fa-check";
      } else if (vm.showReopenButton()) {
        return "fa-history";
      }
    }

    function disablePrimaryButton(){
      return vm.showPinned() ||
        (vm.showReopenButton() && vm.disableReopenButton());
    }

    function primaryButtonClick(task){
      if(vm.showCompleteButton()){
        vm.completeTask(task);
      } else if (vm.showReopenButton()) {
        vm.reopenTask(task);
      }
    }

    function showPinned(){
      return vm.task.pinned;
    }

    function showCompleteButton(){
      return !vm.task.pinned && vm.task.state == 'pending';
    }

    function showReopenButton(){
      return !vm.task.pinned && vm.task.state == 'completed';
    }

    function disableReopenButton(){
      return vm.parentTask && vm.parentTask.state == 'completed';
    }

    function completeTask(task){
      var completeTask = vm.factory.completeTask(task.id);

      completeTask.then(function(response){
        $('.user-donation-amount').text(response.data.user_donation_amount)

        angular.extend(vm.task, response.data);
        setListStyle();
        $scope.$emit("taskCompleted");
      });
    }

    function reopenTask(task){
      var reopenTask = vm.factory.reopenTask(task.id);

      reopenTask.then(function(response){
        $('.user-donation-amount').text(response.data.user_donation_amount)
        
        angular.extend(vm.task, response.data);
        setListStyle();
        $scope.$emit("taskReopened");
      });
    }

    function toggleForm(){
      extendChildren();
      $rootScope.$broadcast('toggleTaskForm', vm.task);
    }

    function allowChildAddition(){
      return vm.allowAddChildren && vm.task.state == 'pending';
    }

    function retractChildren(){
      vm.task.extended = false;

      var updateTask = vm.factory.updateTask(vm.task);
      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
      });
    }

    function extendChildren(){
      vm.task.extended = true;

      var updateTask = vm.factory.updateTask(vm.task);
      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
      });
    }

    function onInit(){
      setListStyle();

      if(vm.showChildren === undefined){ vm.showChildren = true; };
      if(vm.allowExtend === undefined){ vm.allowExtend = true; };
      if(vm.allowReorder === undefined){ vm.allowReorder = true; };
      if(vm.allowAddChildren === undefined){ vm.allowAddChildren = true; };
    }

    function starredClass(){
      return (vm.task.starred ? 'btn-warning' : 'btn-light');
    }

    function toggleStarred(){
      vm.task.starred = !vm.task.starred;

      var updateTask = vm.factory.updateTask(vm.task);

      updateTask.then(function(response){
        angular.extend(vm.task, response.data);
      });
    }

    function setListStyle(){
      var colorHex = vm.task.color_hex;
      var textColor;

      vm.listStyle = {};
      vm.taskLinkStyle = {};

      if(vm.task.state == "completed"){
        vm.backgroundColor = colorHex;
        vm.listStyle.background = vm.backgroundColor;
      } else if(vm.topLevel){
        vm.backgroundColor = colorHex;
        vm.listStyle.background = vm.backgroundColor;
      }

      vm.listStyle.color = vm.colorFactory.getTextColor(vm.backgroundColor);
      vm.taskLinkStyle.color = vm.colorFactory.getTextColor(vm.backgroundColor);
    }

  }

})();
