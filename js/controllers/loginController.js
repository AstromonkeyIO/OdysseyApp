odysseyApp.controller('loginController', function($rootScope, $scope, $location, $document, currentUserService) {

  $scope.submit = function() {

    $.ajax({ 
      type: "GET",
      url: "http://odysseyapistaging.herokuapp.com/api/users/"+ $scope.username +"/" + $scope.password,
      crossDomain: true,
      dataType: "json",
      contentType: 'application/json',
      processData: false,
      success: function(user) {

        $rootScope.currentUser = user; 

        //console.log($scope.color);
        $document.cookie = user;
        currentUserService.setCurrentUser(user);
        console.log($document.cookie);
        $location.path("/boards");
        $scope.$apply();

      },
      error: function(error) {
        console.log(error);
      }
    });


  }
});