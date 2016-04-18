odysseyApp.controller('workflowController', function ($scope, $routeParams, $compile, currentUserService, $cookies) 
{

    $scope.workflows = [];
    $scope.boardId = $routeParams.boardId;
    $scope.taskFormState = "";

    $scope.currentUser = JSON.parse($cookies["currentUser"]);
    console.log($scope.currentUser);

    $scope.comments = [];

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
    
    $scope.addNewWorkflow = function() {

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
                $scope.clearAddNewWorkflowForm(); 
                $('#workflow-form').modal('hide');

            },
            error: function(error) {
              console.log(error);
            }
        });        

    }

    $scope.dimissWorkflowForm = function() {
        $scope.clearAddNewWorkflowForm(); 
    }

    $scope.targetedWorkflow;

    $scope.addTask = function(workflow) {

        $scope.targetedWorkflow = workflow;
        $scope.selectedWorkflowId = workflow._id;
        $scope.taskFormState = "create";
        $scope.taskFormPriority = "P3";

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
        $scope.targetedWorkflow = workflow;
        $scope.taskFormId = task._id;
        $scope.taskFormName = task.title;
        $scope.taskFormDescription = task.description;
        $scope.taskFormDate = task.dueDate;
        $scope.taskFormWorkflow = workflow;
        $scope.taskFormPriority = task.priority;

        console.log(workflow);

        $scope.comments = task.comments.reverse();
        
        if(task.assignee) {
            $scope.assignUserToTask(task.assignee);
        }
    }


    $scope.submitTaskForm = function() {

        var assigneeId;
        if($scope.assignedUser != null)
        {
            assigneeId = $scope.assignedUser._id;
        }

        if($scope.taskFormState == "create") {        

            $.ajax({ 
                type: "POST",
                url: "http://odysseyapistaging.herokuapp.com/api//workflows/"+ $scope.targetedWorkflow._id +"/tasks",
                data: JSON.stringify({ "title": $scope.taskFormName, "description": $scope.taskFormDescription, "dueDate": $scope.taskFormDate, "workflow": $scope.targetedWorkflow._id, "assigneeId": assigneeId, "priority": $scope.taskFormPriority}),
                crossDomain: true,
                dataType: "json",
                contentType: 'application/json',
                processData: false,
                success: function(task) {
                    
                    console.log(task);
                    $scope.targetedWorkflow.tasks.push(task);
                    $scope.$apply();
                    $('#task-form').modal('hide');
                    $scope.clearTaskForm();

                    console.log($scope.assignedUser);
                    //$scope.dismissCreateTaskPopupButtonClicked(); 
                    //send mail to task
                    $.ajax({ 
                        type: "POST",
                        url: "http://odysseyapistaging.herokuapp.com/api/mail/tasks",
                        data: JSON.stringify({"recipientEmail": $scope.assignedUser.email, "assigner": $scope.currentUser, "task": task}),
                        crossDomain: true,
                        dataType: "json",
                        contentType: 'application/json',
                        processData: false,
                        success: function(task) {
                            
                            console.log("mail sent");
                        },
                        error: function(error) {
                          console.log(error);
                        }
                    });
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
                data: JSON.stringify({ "title": $scope.taskFormName, "description": $scope.taskFormDescription, "dueDate": $scope.taskFormDate, "workflow":  $scope.selectedWorkflowId, "assigneeId": assigneeId, "priority": $scope.taskFormPriority}),                
                crossDomain: true,
                dataType: "json",
                contentType: 'application/json',
                processData: false,
                success: function(task) {
                    
                    console.log("editted task ");
                    console.log(task);

                    console.log($scope.taskFormWorkflow);
                    console.log($scope.targetedWorkflow);

                    for(i = 0; i < $scope.taskFormWorkflow.tasks.length; i++) {

                        if($scope.taskFormWorkflow.tasks[i]._id == task._id)
                        {

                            // if the workflow of the task changed
                            if($scope.taskFormWorkflow.tasks[i].workflow != task.workflow) {

                                // remove task from old workflow
                                $scope.taskFormWorkflow.tasks.splice(i , 1);

                                // add task to new workflow
                                console.log(task.workflow);
                                for(var k = 0; k < $scope.workflows.length; k++)
                                {
                                    if($scope.workflows[k]._id == task.workflow) {

                                        console.log("switched");
                                        $scope.workflows[k].tasks.push(task);
                                        $scope.$apply();
                                        break;
                                    }

                                }

                            }
                            else {

                                $scope.targetedWorkflow.tasks[i] = task;

                            }
                            $scope.$apply();
                            break;
                        }

                    }

                    $('#task-form').modal('hide');
                    $scope.clearTaskForm();
                    //$scope.dismissCreateTaskPopupButtonClicked(); 

                },
                error: function(error) {
                  console.log(error);
                }
            });

        }

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

  }

  
  $scope.createNewTaskButtonClicked = function()
  {

    document.getElementById('create-task-popup').style.display='block';
    document.getElementById('fade').style.display='block';

  }
  
    $scope.clearAddNewWorkflowForm = function()
    {



    }

    /* Create, Edit, and Delete Workflow */
    $scope.setTargetWorkflow = function(workflow) {
        $scope.targetWorkflow = workflow;
        $scope.editWorkflowTitle = workflow.title;
    }

    $scope.editWorkflow = function() {

        $.ajax({ 
            type: "PUT",
            url: "http://odysseyapistaging.herokuapp.com/api/workflows/"+ $scope.targetWorkflow._id,
            data: JSON.stringify({ "title": $scope.editWorkflowTitle}),                
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(workflow) {
                
                for(var i = 0; i < $scope.workflows.length ; i++) {

                    if($scope.workflows[i]._id == workflow._id)
                    {

                        $scope.workflows[i].title = workflow.title;
                        $scope.$apply();
                        break;
                    }

                }

                $('#edit-workflow-form').modal('hide'); 

            },
            error: function(error) {
              console.log(error);
            }
        });

    }

    $scope.deleteWorkflow = function() {

        // Delete the workflow from the UI first for better user experience
        for(var i = 0; i < $scope.workflows.length ; i++) {

            if($scope.workflows[i]._id == $scope.targetWorkflow._id)
            {

                $scope.workflows.splice(i, 1);
                break;
            }

        }        

        $('#edit-workflow-form').modal('hide');

        var tasksToDelete = $scope.targetWorkflow.tasks;

        $.ajax({ 
            type: "DELETE",
            url: "http://odysseyapistaging.herokuapp.com/api/workflows/"+ $scope.targetWorkflow._id,               
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(workflow) {
                
                for(var i = 0; i < tasksToDelete.length; i++) {

                    $.ajax({ 
                        type: "DELETE",
                        url: "http://odysseyapistaging.herokuapp.com/api/tasks/"+tasksToDelete[i]._id,
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

            },
            error: function(error) {
                console.log(error);
            }
        });

    }


    $scope.dismissEditWorkflowForm = function() {

        $('#edit-workflow-form').modal('hide'); 

    }
    /* */    




    $scope.clearTaskForm = function()
    {
        $scope.taskFormName = "";
        $scope.taskFormDescription = "";
        $scope.taskFormDate = "";
        $scope.taskFormAssignee = "";
        $('#create-new-task-button').attr("disabled", true);   
    }


  function test1 () {
    console.log("test 1");
  }


    $scope.assigneeInputKeyEvent = function(keyEvent) {

        //console.log($scope.taskFormAssignee);
        if($scope.taskFormAssignee == "")
        {
            $scope.assignees = [];         
        }
        console.log($scope.taskFormAssignee);

        $.ajax({ 
          type: "GET",
          url: "http://odysseyapistaging.herokuapp.com/api/users?q=" + $scope.taskFormAssignee,
          crossDomain: true,
          dataType: "json",
          contentType: 'application/json',
          processData: false,
          success: function(users) {
            
            $scope.assignees = [];
            console.log(users);
            $scope.assignees = users;
            $scope.$apply();

          },
          error: function(error) {
            console.log(error);
          }
        });
    }


    $scope.assignUserToTask = function(assignee) {
        console.log("assigned user");
        $scope.assignedUser = assignee;
        $(".assigneeInput").css("display", "none");
        $scope.taskFormAssignee = "";
        $scope.assignees = [];
    }  

    $scope.removeAssignee = function(assignee) {
        $scope.assignedUser = null;
        $(".assigneeInput").css("display", "block");
    }   


    $scope.dismissTaskForm = function() {
        $scope.assignedUser = null;
        $(".assigneeInput").css("display", "block");
        $scope.taskFormAssignee = "";
        $scope.assignees = [];
    }


    $scope.createNewTaskButtonClicked = function (workflowId)
    {
        angular.element($('#body')).scope().createNewTaskButtonClicked(workflowId);
    }

    $scope.showTaskDetailsView = function() {

        $(".task-details-view").css("display", "block");
        $("#task-details-tab").addClass("active");

        $(".task-comments-view").css("display", "none");
        $("#task-comments-tab").removeClass("active");
    }

    $scope.showTaskCommentsView = function() {

        $(".task-details-view").css("display", "none");
        $("#task-details-tab").removeClass("active");

        $(".task-comments-view").css("display", "block");
        $("#task-comments-tab").addClass("active");

    }

    $scope.addComment = function(newComment) {

        console.log($scope.taskFormId);
        console.log($scope.currentUser);

        $.ajax({ 
            type: "POST",
            url: "http://odysseyapistaging.herokuapp.com/api/comments/",
            data: JSON.stringify({ "creatorId": $scope.currentUser._id, "taskId": $scope.taskFormId, "comment": newComment }),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(comment) {
                
                comment.creator = $scope.currentUser;
                $scope.newComment = "";
                $scope.comments.push(comment);
                $scope.$apply();
            },
            error: function(error) {
              console.log(error);
            }
        });

    }


    //code for left menu bar
    $(function () {
        /* START OF DEMO JS - NOT NEEDED */
        if (window.location == window.parent.location) {
            $('#fullscreen').html('<span class="glyphicon glyphicon-resize-small"></span>');
            $('#fullscreen').attr('href', 'http://bootsnipp.com/mouse0270/snippets/PbDb5');
            $('#fullscreen').attr('title', 'Back To Bootsnipp');
        }    
        $('#fullscreen').on('click', function(event) {
            event.preventDefault();
            window.parent.location =  $('#fullscreen').attr('href');
        });
        $('#fullscreen').tooltip();
        $('.navbar').hover(function(event) {
            event.preventDefault();
            $(this).closest('.navbar-minimal').toggleClass('open');
        })
    });



    function displayTaskDetailPopup(taskName)
    {

        angular.element($('#body')).scope().displayTaskDetailPopup(taskName);
        return false;

    }

});