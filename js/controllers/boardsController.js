odysseyApp.controller('boardsController', function($scope, $routeParams) {

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
					$scope.boardsList.push({
						id: boards[i]._id,
						title: boards[i].title,
						description: boards[i].description
					});					
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
				
				$scope.boardsList.push({
					id: board._id,
					title: board.title ,
					description: board.description
				});

				$scope.$apply();

				$('#createBoardPopup').modal('hide')

			},
			error: function(error) {
			  console.log(error);
			}
		});

	};
});