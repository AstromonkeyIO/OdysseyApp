odysseyApp.controller('boardsController', function($scope) {

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
					console.log("im here");
					$scope.boardsList.push({
						name: $scope.num,
						description: 'description'
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
		$scope.num++;
		$scope.boardsList.push({
			name: 'Board' + $scope.num,
			description: 'dentist'
		});

	};
});