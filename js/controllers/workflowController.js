odysseyApp.controller('workflowController', function ($scope, $routeParams, $compile) 
{

    $scope.workflows = [];
    $scope.workflow = function(name) {
        this.name = name;
        this.tasks = [];
        this.addTask = function(newTask) {
            this.tasks.push(newTask);
        }
    };

    $scope.$on('$routeChangeSuccess', function() {

        $.ajax({ 
            type: "GET",
            url: "http://odysseyapistaging.herokuapp.com/api/tasks?boardId=" + $routeParams.boardId,
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(tasks) {

                console.log(tasks);
                for(i = 0; i < tasks.length; i++)
                {

                    var workflowExist = false;

                    // if the workflow currently exists on the page, add the task to the existing workflow
                    for(k = 0; k < $scope.workflows.length; k++)
                    {

                        if($scope.workflows[k].name == tasks[i].workflow)
                        {

                            /*
                            var taskTemplate = document.getElementById('task-template').innerHTML;
                            taskTemplate = Mustache.render(taskTemplate, tasks[i]);
                            $("#" + tasks[i].workflow + " ul").append(taskTemplate);
                            */
                            workflowExist = true;
                            break;

                        }

                    }

                    // if the workflow doesn't exist create a new one
                    if(workflowExist == false)
                    {
                        console.log("I'm here");   
                        var newWorkflow = new $scope.workflow(tasks[i].workflow);
                        var workflowTemplate = document.getElementById('workflow-template').innerHTML;
                        $scope.workflows.push(newWorkflow);
                        /*
                        workflowTemplate = Mustache.render(workflowTemplate, newWorkflow);
                        $('#workflow-container').append(workflowTemplate);

                        var taskTemplate = document.getElementById('task-template').innerHTML;
                        taskTemplate = Mustache.render(taskTemplate, tasks[i]);
                        $("#" + tasks[i].workflow + " ul").append(taskTemplate);
                        */
                    }

                }

                $scope.$apply();

                console.log($scope.workflows);

            },
            error: function(error) {
                console.log(error);
            }
        });      

    });

  $scope.addWorkflowButtonClicked = function() 
  {

    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';

  }

  $scope.dismissPopupButtonClicked = function() 
  {

    document.getElementById('light').style.display='none';
    document.getElementById('fade').style.display='none';
    $('#create-new-workflow-input').val("");    
      $('#create-new-workflow-button').attr("disabled", true);  
    $scope.clearAddNewWorkflowForm();

  }

  $scope.checkDataInCreateNewWorkflowInput = function() 
  {

    if($scope.newWorkflowName == "") {
      $('#create-new-workflow-button').attr("disabled", true);
    } else {
      $('#create-new-workflow-button').attr("disabled", false);
    }

  }

  $scope.addNewWorkflow = function() 
  {

    var newWorkflowName = $scope.newWorkflowName;
    $scope.dismissPopupButtonClicked();
    var workflow = {
      id: "1",
        name: newWorkflowName
    };

    var workflowTemplate = document.getElementById('workflow-template').innerHTML;
      workflowTemplate = Mustache.render(workflowTemplate, workflow);
      
    $('#workflow-container').append(workflowTemplate);

  }

  $scope.clearAddNewWorkflowForm = function()
  {

    $scope.newWorkflowName = "";
    $('#create-new-workflow-input').val("");    
    $('#create-new-workflow-button').attr("disabled", true);    

  }

  /*
  $scope.createNewTaskButtonClicked = function(workflowId)
  {

    document.getElementById('create-task-popup').style.display='block';
    document.getElementById('fade').style.display='block';
    $scope.workflowId = workflowId;

  }
  */

  $scope.createNewTask = function()
  {

    var task = {
      id:"",
      name: $scope.createTaskForm.taskName,
      description: $scope.createTaskForm.description,
      date: $scope.createTaskForm.date,
      priority: "",
      assignee: ""
    }
    var taskTemplate = document.getElementById('task-template').innerHTML;
      taskTemplate = Mustache.render(taskTemplate, task);

      console.log($scope.workflowId);
      $("#" + $scope.workflowId + " ul").append(taskTemplate);

    $scope.dismissCreateTaskPopupButtonClicked(); 

  }

  $scope.clearAddNewWorkflowForm = function()
  {



  }

  $scope.dismissCreateTaskPopupButtonClicked = function()
  {

    document.getElementById('create-task-popup').style.display='none';
    document.getElementById('fade').style.display='none';
    $scope.clearCreateTaskForm();

  }

  $scope.clearCreateTaskForm = function()
  {

    $scope.createTaskForm.taskName = "";
    $scope.createTaskForm.description = "";
    $scope.createTaskForm.date = "";
    $scope.createTaskForm.assignee = "";
    $('#create-new-task-button').attr("disabled", true);    


  }

  $scope.displayTaskDetailPopup = function(taskName)
  {
    console.log("here");
    document.getElementById('create-task-popup').style.display='block';
    document.getElementById('fade').style.display='block';

    $scope.createTaskForm.taskName = taskName; 
    $('#task-name-input').val(taskName);

  }

  function test1 () {
    console.log("test 1");
  }

  $scope.createNewTaskButtonClicked =function (workflowId)
  {
    console.log("yooyo");

    angular.element($('#body')).scope().createNewTaskButtonClicked(workflowId);

  }

  function displayTaskDetailPopup(taskName)
  {

    angular.element($('#body')).scope().displayTaskDetailPopup(taskName);
    return false;

  }

});