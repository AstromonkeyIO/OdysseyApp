odysseyApp.controller('workflowController', function ($scope, $routeParams, $compile) 
{

    $scope.workflows = [];
    $scope.boardId = $routeParams.boardId;
    $scope.taskFormState = "";

    $scope.workflow = function(workflowObject) {
        
        this.title = workflowObject.title;
        this.tasks = workflowObject.tasks;
        this.taskIds = [];
        this.addTask = function(newTask) {
            this.tasks.push(newTask);
        };
        this.deleteTask = function(taskId) {

            for(i = 0; i < this.tasks.length; i++) {

                if(this.tasks[i]._id == taskId) {
                    this.tasks.splice(i, 1);
                }

            }

        };
        this.editTask = function(task) {

            for(i = 0; i < this.tasks.length; i++) {

                if(this.tasks[i]._id == task._id) {

                    this.tasks[i] = task;
                    console.log(this.tasks[i]);

                }

            }

        }
    };

    $.ajax({ 
        type: "GET",
        url: "http://odysseyapistaging.herokuapp.com/api/boards/" + $routeParams.boardId + "/workflows",
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        processData: false,
        success: function(workflows) {

            console.log(workflows);
            for(i = 0; i < workflows.length; i++)
            {

                $scope.workflows.push(workflows[i]);

            }
            $scope.$apply();
        },
        error: function(error) {
            console.log(error);
        }
    }); 
    
    /*
    $scope.$on('$routeChangeSuccess', function() {
    
    });
    */

    $scope.addNewWorkflow = function() {


        console.log("I'm here");
        $.ajax({ 
            type: "POST",
            url: "http://odysseyapistaging.herokuapp.com/api/workflows",
            data: JSON.stringify({ "title": $scope.newWorkflowTitle, "boardId": $scope.boardId}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(workflow) {
                
                $scope.workflows.push(workflow);
                $scope.$apply();
                document.getElementById('light').style.display='none';
                document.getElementById('fade').style.display='none';
                $('#create-new-workflow-input').val("");    
                $('#create-new-workflow-button').attr("disabled", true);  
                $scope.clearAddNewWorkflowForm();                

            },
            error: function(error) {
              console.log(error);
            }
        });        

    }

    $scope.targetedWorkflow;

    $scope.addTask = function(workflow) {

        $scope.targetedWorkflow = workflow;
        $scope.taskFormState = "create";
        document.getElementById('create-task-popup').style.display='block';
        document.getElementById('fade').style.display='block';

    }

    $scope.deleteTask = function(taskId, workflow) {
        
        for(i = 0; i < workflow.tasks.length; i++) {

            if(workflow.tasks[i]._id == taskId)
            {
                workflow.tasks.splice(i, 1);
            }

        }

        $.ajax({ 
            type: "DELETE",
            url: "http://odysseyapistaging.herokuapp.com/api/tasks/"+taskId,
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(task) {
                console.log(task);
            },
            error: function(error) {
              console.log(error);
            }
        });

    }

    $scope.editTask = function(task, workflow) {
    
        $scope.taskFormState = "edit";

        document.getElementById('create-task-popup').style.display='block';
        document.getElementById('fade').style.display='block';  

        $scope.taskFormId = task._id;
        $scope.taskFormName = task.title;
        $scope.taskFormDescription = task.description;
        $scope.taskFormWorkflow = workflow;

    }


    $scope.submitTaskForm = function() {

        if($scope.taskFormState == "create") {        

            $.ajax({ 
                type: "POST",
                url: "http://odysseyapistaging.herokuapp.com/api//workflows/"+ $scope.targetedWorkflow._id +"/tasks",
                data: JSON.stringify({ "title": $scope.taskFormName, "description": $scope.taskFormDescription, "workflow": $scope.targetedWorkflow._id}),
                crossDomain: true,
                dataType: "json",
                contentType: 'application/json',
                processData: false,
                success: function(task) {
                    
                    console.log("i'm here");
                    console.log(task);
                    $scope.targetedWorkflow.tasks.push(task);
                    $scope.$apply();
                    $scope.dismissCreateTaskPopupButtonClicked(); 
                    
                },
                error: function(error) {
                  console.log(error);
                }
            });
        }
        else {

            // edit task and save to database
            $.ajax({ 
                type: "PUT",
                url: "http://odysseyapistaging.herokuapp.com/api/tasks/"+ $scope.taskFormId,
                data: JSON.stringify({ "title": $scope.taskFormName, "description": $scope.taskFormDescription, "workflow": $scope.taskFormWorkflow.name}),                
                crossDomain: true,
                dataType: "json",
                contentType: 'application/json',
                processData: false,
                success: function(task) {
                    $scope.taskFormWorkflow.editTask(task);
                    $scope.$apply();
                    $scope.dismissCreateTaskPopupButtonClicked(); 
                },
                error: function(error) {
                  console.log(error);
                }
            });

        }

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

    $scope.taskFormName = "";
    $scope.taskFormDescription = "";
    $scope.taskFormDate = "";
    $scope.taskFormAssignee = "";
    $('#create-new-task-button').attr("disabled", true);    

  }

/*
  $scope.displayTaskDetailPopup = function(taskName)
  {
    console.log("here");
    document.getElementById('create-task-popup').style.display='block';
    document.getElementById('fade').style.display='block';

    $scope.createTaskForm.taskName = taskName; 
    $('#task-name-input').val(taskName);

  }
*/
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