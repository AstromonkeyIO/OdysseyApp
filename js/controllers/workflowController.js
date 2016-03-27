odysseyApp.controller('workflowController', function ($scope, $routeParams, $compile) 
{

    $scope.workflows = [];
    $scope.boardId = $routeParams.boardId;

    console.log($scope.boardId);
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
                            $scope.workflows[k].addTask(tasks[i]);
                            $scope.$apply();
                            workflowExist = true;
                        }

                    }

                    // if the workflow doesn't exist create a new one
                    if(workflowExist == false)
                    {
                        var newWorkflow = new $scope.workflow(tasks[i].workflow);
                        
                        if(newWorkflow.name == tasks[i].workflow)
                            newWorkflow.addTask(tasks[i]);

                        $scope.workflows.push(newWorkflow);

                    }

                }
                $scope.$apply();
            },
            error: function(error) {
                console.log(error);
            }
        });      

    });

    $scope.addNewWorkflow = function() {

        var newWorkflow = new $scope.workflow($scope.newWorkflowName);
        $scope.workflows.push(newWorkflow)
        document.getElementById('light').style.display='none';
        document.getElementById('fade').style.display='none';
        $('#create-new-workflow-input').val("");    
        $('#create-new-workflow-button').attr("disabled", true);  
        $scope.clearAddNewWorkflowForm();
        //$scope.$apply();

    }

    $scope.targetedWorkflow;

    $scope.displayCreateTaskPopup = function(workflow) {

      $scope.targetedWorkflow = workflow;
      document.getElementById('create-task-popup').style.display='block';
      document.getElementById('fade').style.display='block';

    }

    $scope.createNewTask = function() {

        $.ajax({ 
            type: "POST",
            url: "http://odysseyapistaging.herokuapp.com/api/tasks",
            data: JSON.stringify({ "title": $scope.createTaskForm.taskName, "description": $scope.createTaskForm.description, "boardId": $scope.boardId, "workflow": $scope.targetedWorkflow.name}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(task) {
                
                if(typeof(task.code) != 'undefined') 
                {
                    console.log(task.code);
                }
                else 
                {
                    $scope.targetedWorkflow.tasks.push(task);
                    $scope.$apply();
                    $scope.dismissCreateTaskPopupButtonClicked(); 
                }

            },
            error: function(error) {
              console.log(error);
            }
        });

    }    


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

  $scope.clearAddNewWorkflowForm = function()
  {

    $scope.newWorkflowName = "";
    $('#create-new-workflow-input').val("");    
    $('#create-new-workflow-button').attr("disabled", true);    

  }

  
  $scope.createNewTaskButtonClicked = function()
  {

    document.getElementById('create-task-popup').style.display='block';
    document.getElementById('fade').style.display='block';

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