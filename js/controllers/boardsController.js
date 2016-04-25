odysseyApp.controller('boardsController', function($rootScope, $scope, $routeParams, $document, $cookieStore, currentUserService, $cookies, $location) {

	$scope.boardsList = [];
	$scope.num = 0;

	$scope.boardPopupState = "create";
	$scope.editBoardId = "";

	$scope.searchTaskResults = [];
    
	$scope.currentUser = JSON.parse($cookies.currentUser);
	console.log($scope.currentUser.username);
    //$scope.currentUser = currentUserService.getCurrentUser();
	$.ajax({ 
		type: "GET",
		url: "http://odysseyapistaging.herokuapp.com/api/boards",
		crossDomain: true,
		dataType: "json",
		contentType: 'application/json',
		processData: false,
		success: function(boards) {

			console.log(boards);
			for(i = 0; i < boards.length; i++)
			{

				if(typeof(boards[i].title) != 'undefined')
				{
					$scope.boardsList.push(boards[i]);					
				}
			}

			$scope.$apply();

		},
		error: function(error) {
			console.log(error);
		}
	});

	$scope.submitBoardForm = function(){

		if($scope.boardPopupState == "create") {

			$.ajax({ 
				type: "POST",
				url: "http://odysseyapistaging.herokuapp.com/api/boards",
				data: JSON.stringify({ "title": $scope.newBoardTitle, "description": $scope.newBoardDescription, "creatorId": $scope.currentUser._id, "boardKey": $scope.newBoardKey }),
				crossDomain: true,
				dataType: "json",
				contentType: 'application/json',
				processData: false,
				success: function(board) {
					
					$('#create-board-button').prop('disabled', true);
        			$('#create-board-button').html('Creating Board...').fadeIn();
					if(typeof(board.error) != 'undefined') {
						$('#create-board-button').prop('disabled', false);
						$('#create-board-button').html(board.error);
						setTimeout(function() {
        					$('#create-board-button').html('Create Board!').fadeIn();
            			}, 1000);

					} else {
						board.creator = $scope.currentUser;
						$scope.boardsList.push(board);
						$scope.$apply();
						$('#createBoardPopup').modal('hide');
						$('#create-board-button').html('Create Board!').fadeIn();
					}

				},
				error: function(error) {
				  console.log(error);
				}
			});

		} else {
			
			// send api cal to edit the board
			boardId = $scope.editBoardId;	

			$.ajax({ 
				type: "PUT",
				url: "http://odysseyapistaging.herokuapp.com/api/boards/"+boardId,
				data: JSON.stringify({ "title": $scope.newBoardTitle, "description": $scope.newBoardDescription}),
				crossDomain: true,
				dataType: "json",
				contentType: 'application/json',
				processData: false,
				success: function(board) {
				
					for(i = 0; i < $scope.boardsList.length; i++) {
						if($scope.boardsList[i]._id == board._id) {

							board.creator = $scope.currentUser;
							$scope.boardsList[i] = board;
							$scope.editBoardId = "";
							$scope.$apply();
							$('#createBoardPopup').modal('hide');
							break;
						}
					}

				},
				error: function(error) {
				  console.log(error);
				}
			});

		}

	};

	$scope.deleteBoard = function(boardId) {

		var boardId = boardId
		$.ajax({ 
			type: "DELETE",
			url: "http://odysseyapistaging.herokuapp.com/api/boards/"+boardId,
			crossDomain: true,
			dataType: "json",
			contentType: 'application/json',
			processData: false,
			success: function(board) {
				
				for(i = 0; i < $scope.boardsList.length; i++) {
					if($scope.boardsList[i]._id == boardId) {
						$scope.boardsList.splice(i, 1);
						$scope.$apply();
					}
				}

			},
			error: function(error) {
			  console.log(error);
			}
		});

	};

	$scope.editBoard = function(board) {
		
		$('#createBoardPopup').modal('show');
		$scope.newBoardTitle = board.title;
		$scope.newBoardDescription = board.description;
		$scope.boardPopupState = "edit";
		$scope.editBoardId = board._id;		

	};

	$scope.dismissBoardPopup = function() {

		$scope.newBoardTitle = "";
		$scope.newBoardDescription = "";
		$scope.boardPopupState = "create";			
	}

	$scope.searchTaskInputEvent = function(e) {
		console.log($scope.searchTaskKey);

		$scope.searchTaskResults = [];

		if($scope.searchTaskKey) {

	        $.ajax({ 
	          type: "GET",
	          url: "http://odysseyapistaging.herokuapp.com/api/tasks?q=" + $scope.searchTaskKey,
	          crossDomain: true,
	          dataType: "json",
	          contentType: 'application/json',
	          processData: false,
	          success: function(taskResults) {
	          	console.log(taskResults);
	          	$scope.searchTaskResults = taskResults;
	          	$scope.$apply();

	          },
	          error: function(error) {
	            console.log(error);
	          }
	        });

    	}

	}

	$scope.navigateToTask = function(boardId, taskId) {
		$location.path("/boards/"+boardId+"/"+taskId); 
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


    $scope.logout = function() {

		$cookies.currentUser = "";  
		$location.path("/login");  	

    }

    //resetting task popup when it is closed
    $(document).ready(function()
    {   
        // codes works on all bootstrap modal windows in application
        $('.modal').on('hidden.bs.modal', function(e)
        { 
            // Clear Board Popup Form
            $scope.newBoardTitle = "";
            $scope.newBoardDescription = "";
            $scope.newBoardKey = "";
            $scope.$apply();
        });

    });
    //
});