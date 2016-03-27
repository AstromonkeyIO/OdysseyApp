odysseyApp.controller('boardsController', function($scope, $routeParams, AuthService, UserService) {

	$scope.boardsList = [];
	$scope.num = 0;

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

	$scope.createBoard = function(){

		$.ajax({ 
			type: "POST",
			url: "http://odysseyapistaging.herokuapp.com/api/boards",
			data: JSON.stringify({ "title": $scope.newBoardTitle, "description": $scope.newBoardDescription}),
			crossDomain: true,
			dataType: "json",
			contentType: 'application/json',
			processData: false,
			success: function(board) {
				
				$scope.boardsList.push(board);

				$scope.$apply();

				$('#createBoardPopup').modal('hide')

			},
			error: function(error) {
			  console.log(error);
			}
		});

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
				
				console.log(board);
				for(i = 0; i < $scope.boardsList.length; i++) {
					if($scope.boardsList[i]._id == boardId) {
						console.log(i);
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

});