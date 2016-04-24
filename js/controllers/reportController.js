odysseyApp.controller('reportController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService, $cookies) {


	$scope.tasks = [];

	$scope.searchSelector = "createdBy";

    $scope.searchInputKeyEvent = function(keyEvent) {

        $scope.searchResults = [];

		if($scope.searchInput && ($scope.searchSelector == "createdBy" || $scope.searchSelector == "assignedTo")) {

			$.ajax({ 
			  type: "GET",
			  url: "http://odysseyapistaging.herokuapp.com/api/users?q=" + $scope.searchInput,
			  crossDomain: true,
			  dataType: "json",
			  contentType: 'application/json',
			  processData: false,
			  success: function(users) {
			    
			    $scope.searchResults = [];
			    $scope.searchResults = users;

			    console.log($scope.searchResults);
			    $scope.$apply();

			  },
			  error: function(error) {
			    console.log(error);
			  }
			});

		} else if($scope.searchInput && $scope.searchSelector == "boards") {

			$.ajax({ 
			  type: "GET",
			  url: "http://odysseyapistaging.herokuapp.com/api/boards?q=" + $scope.searchInput,
			  crossDomain: true,
			  dataType: "json",
			  contentType: 'application/json',
			  processData: false,
			  success: function(users) {
			    
			    $scope.searchResults = [];
			    $scope.searchResults = users;

			    console.log($scope.searchResults);
			    $scope.$apply();

			  },
			  error: function(error) {
			    console.log(error);
			  }
			});
		}

    }

    $scope.selectedCreatedBy = function() {
		$scope.searchSelector = "createdBy";	
    }

    $scope.selectedAssignedTo = function() {
		$scope.searchSelector = "assignedTo";	
    }

    $scope.selectedBoards = function() {
		$scope.searchSelector = "boards";	
    }

	$scope.selectUser = function(user) {

		$scope.selectedUser = user;
		$scope.searchInput = user.username;
		$scope.searchResults = [];

	}

	$scope.selectBoard = function(board) {
		$scope.selectedBoard = board;
		$scope.searchInput = board.title;
		$scope.searchResults = [];	
	}

	$scope.searchTasks = function() {

		if($scope.searchSelector === "createdBy") {

			$.ajax({ 
				type: "GET",
				url: "http://odysseyapistaging.herokuapp.com/api/report/creator/" + $scope.selectedUser._id,
				crossDomain: true,
				dataType: "json",
				contentType: 'application/json',
				processData: false,
				success: function(tasks) {
					console.log(tasks);
					$scope.tasks = tasks;
					$scope.$apply();
				},
				error: function(error) {
					console.log(error);
				}
			});

		} else if($scope.searchSelector === "assignedTo") {
			
			$.ajax({ 
				type: "GET",
				url: "http://odysseyapistaging.herokuapp.com/api/report/assignee/" + $scope.selectedUser._id,
				crossDomain: true,
				dataType: "json",
				contentType: 'application/json',
				processData: false,
				success: function(tasks) {
					console.log(tasks);
					$scope.tasks = tasks;
					$scope.$apply();
				},
				error: function(error) {
					console.log(error);
				}
			});

		} else if($scope.searchSelector === "boards") {
			
		    $.ajax({ 
		        type: "GET",
		        url: "http://odysseyapistaging.herokuapp.com/api/boards/" + $scope.selectedBoard._id + "/workflows",
		        crossDomain: true,
		        dataType: "json",
		        contentType: 'application/json',
		        processData: false,
		        success: function(workflows) {

		            var tempTasks = [];
		            for(i = 0; i < workflows.length; i++)
		            {
		            	for(k = 0; k < workflows[i].tasks.length; k++) {
							workflows[i].tasks[k].workflow = workflows[i];
		            		tempTasks.push(workflows[i].tasks[k]);

		            	}

		            }
		            $scope.tasks = tempTasks;
		            $scope.$apply();
		        },
		        error: function(error) {
		            console.log(error);
		        }
		    }); 

		}

	}

    $scope.logout = function() {

		$cookies.currentUser = "";  
		$location.path("/login");  	

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
	


});