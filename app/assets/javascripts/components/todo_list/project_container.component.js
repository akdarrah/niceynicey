(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      tasksIndex: '=',
      readOnly: '='
    }
  });

  ProjectContainerController.$inject = ['$scope', '$http', 'taskFactory', 'checkpointFactory'];

  function ProjectContainerController($scope, $http, taskFactory, checkpointFactory){
    var vm = this;
    vm.factory = taskFactory;
    vm.checkpointFactory = checkpointFactory;

    vm.handleSubmit = handleSubmit;
    vm.placeHolderText = placeHolderText;
    vm.quoteDirectionText = quoteDirectionText;
    vm.createCheckpoint = createCheckpoint;
    vm.showForm = showForm;
    vm.completedTaskCount = completedTaskCount;
    vm.quote = gon.quote;

    vm.tasks = [];
    vm.parentTask = null;
    vm.tasksIndex = false;
    vm.readOnly = false;

    vm.$onInit = onInit;

    ///////////////////////////////

    function handleSubmit(){
      var label = vm.todoText;
      var parentTaskId = (vm.parentTask ? vm.parentTask.id : null);
      var createTask = vm.factory.createTask(label, parentTaskId);

      createTask.then(function(response){
        vm.tasks.unshift(response.data);
        vm.todoText = '';
      });
    }

    function placeHolderText(){
      if(vm.parentTask){
        return "Add subtask to " + vm.parentTask.label;
      } else {
        return "Add Project (e.g. School, Work, Home)";
      }
    }

    function quoteDirectionText(){
      if(vm.parentTask){
        return "Add a subtask to get started! ☝️";
      } else {
        return "Add a project to get started! ☝️";
      }
    }

    function onInit(){
      if(vm.tasksIndex){
        getTasks();
      }

      // Javascript
      var data = {
        labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
          "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

        datasets: [
          {
            title: "Some Data",
            values: [25, 40, 30, 35, 8, 52, 17, -4]
          },
          {
            title: "Another Set",
            values: [25, 50, -10, 15, 18, 32, 27, 14]
          },
          {
            title: "Yet Another",
            values: [15, 20, -3, -15, 58, 12, -17, 37]
          }
        ]
      };

      var chart = new Chart({
        parent: "#chart", // or a DOM element
        title: "My Awesome Chart",
        data: data,
        type: 'bar', // or 'line', 'scatter', 'pie', 'percentage'
        height: 250,

        colors: ['#7cd6fd', 'violet', 'blue'],
        // hex-codes or these preset colors;
        // defaults (in order):
        // ['light-blue', 'blue', 'violet', 'red',
        // 'orange', 'yellow', 'green', 'light-green',
        // 'purple', 'magenta', 'grey', 'dark-grey']

      });
    }

    function createCheckpoint(){
      var createCheckpoint;

      if(vm.parentTask){
        createCheckpoint = vm.checkpointFactory.createCheckpoint(vm.parentTask.id);
      } else {
        createCheckpoint = vm.checkpointFactory.createCheckpoint();
      }

      createCheckpoint.then(function(response){
        if(vm.parentTask){
          $scope.$emit('checkpointCreated');
        } else {
          getTasks();
        }
      });
    }

    function getTasks(){
      var getTasks = vm.factory.getTasks();

      getTasks.then(function(response){
        vm.tasks = response.data;
      });
    }

    function showForm(){
      return !vm.readOnly && (!vm.parentTask || vm.parentTask.state == 'pending');
    }

    function completedTaskCount(tasks){
      var parentTasks = tasks || vm.tasks || [];

      var completedCount = parentTasks.map(function(task){
        return (task.state == "completed" ? 1 : 0);
      }).reduce(function(sum, number){
        return sum + number;
      }, 0);

      var completedChildrenCount = parentTasks.map(function(task){
        return completedTaskCount(task.children);
      }).reduce(function(sum, number){
        return sum + number;
      }, 0);

      return completedCount + completedChildrenCount;
    }

  }

})();
