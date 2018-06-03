(function() {
  'use strict';

  angular.module('projectContainer', []).component('projectContainer', {
    templateUrl: 'components/todo_list/project_container.html',
    controller: ProjectContainerController,
    bindings: {
      tasks: '<',
      parentTask: '<',
      tasksIndex: '=',
      showToday: '<',
      showHeaders: '<'
    }
  });

  ProjectContainerController.$inject = ['$scope', '$http', 'taskFactory', 'checkpointFactory', '$window', '$filter'];

  function ProjectContainerController($scope, $http, taskFactory, checkpointFactory, $window, $filter){
    var vm = this;
    vm.factory = taskFactory;
    vm.checkpointFactory = checkpointFactory;

    vm.starredTaskFilter = starredTaskFilter;
    vm.handleSubmit = handleSubmit;
    vm.placeHolderText = placeHolderText;
    vm.quoteDirectionText = quoteDirectionText;
    vm.showForm = showForm;
    vm.completedTaskCount = completedTaskCount;
    vm.quote = gon.quote;

    vm.analyticsCompletedCount = 0;
    vm.activeMenuItem = "checkpoint";
    vm.loading = false;
    vm.analytics = {};
    vm.tasks = [];
    vm.parentTask = null;
    vm.tasksIndex = false;

    vm.$onInit = onInit;
    vm.switchMenuItem = switchMenuItem;

    $scope.$on("taskCompleted", function(event){
      renderAnalytics();
    });

    $scope.$on("taskReopened", function(event){
      renderAnalytics();
    });

    ///////////////////////////////

    function starredTaskFilter(){
      if(!vm.tasks){
        return [];
      }

      var flattened = flattenedTasks(vm.tasks);
      var isStarred = function(task){
        return task.starred;
      };

      return $filter('filter')(flattened, isStarred);
    }

    function flattenedTasks(tasks){
      return tasks.reduce(function(flattened, task){
        flattened = flattened.concat(task);
        flattened = flattened.concat(flattenedTasks(task.children));

        return flattened;
      }, []);
    }

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

      renderAnalytics();
    }

    function renderAnalytics(){
      var getAnalytics;

      if(vm.parentTask){
        getAnalytics = vm.factory.getAnalytics(vm.parentTask.id);
      } else {
        getAnalytics = vm.factory.getAnalytics();
      }

      getAnalytics.then(function(response){
        vm.analytics = response.data;

        vm.analyticsCompletedCount = Object.values(vm.analytics).reduce(function(sum, number){
          return sum + number;
        }, 0);

        var heatmap = new Chart({
          parent: "#heatmap",
          type: 'heatmap',
          height: 115,
          data: vm.analytics,
          discrete_domains: 1,
          legend_colors: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
        });
      });
    }

    function getTasks(){
      vm.loading = true;
      var getTasks = vm.factory.getTasks();

      getTasks.then(function(response){
        vm.tasks = response.data;
        vm.loading = false;
      });
    }

    function switchMenuItem(menuChoice){
      vm.activeMenuItem = menuChoice;
    }

    function showForm(){
      return !vm.parentTask || vm.parentTask.state == 'pending';
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
