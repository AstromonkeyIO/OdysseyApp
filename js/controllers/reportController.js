odysseyApp.controller('reportController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService, $cookies) {


	$scope.tasks = [];

	$scope.searchSelector = "createdBy";

    $scope.searchInputKeyEvent = function(keyEvent) {

        if($scope.searchInput == "")
        {
            $scope.users = [];         
        } 

		$.ajax({ 
		  type: "GET",
		  url: "http://odysseyapistaging.herokuapp.com/api/users?q=" + $scope.searchInput,
		  crossDomain: true,
		  dataType: "json",
		  contentType: 'application/json',
		  processData: false,
		  success: function(users) {
		    
		    $scope.users = [];
		    console.log(users);
		    $scope.users = users;
		    $scope.$apply();

		  },
		  error: function(error) {
		    console.log(error);
		  }
		});

    }

    $scope.selectedCreatedBy = function() {
		$scope.searchSelector = "createdBy";	
    }

    $scope.selectedAssignedTo = function() {
		$scope.searchSelector = "assignedTo";	
    }

	$scope.selectUser = function(user) {

		$scope.selectedUser = user;
		$scope.searchInput = user.username;
		$scope.users = [];

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