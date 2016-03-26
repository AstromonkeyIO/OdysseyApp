odysseyApp.controller('loginController', function($scope, $location, $window) {

  $scope.submit = function() {

    $.ajax({ 
      type: "GET",
      url: "http://odysseyapistaging.herokuapp.com/api/users/"+ $scope.username +"/" + $scope.password,
      crossDomain: true,
      dataType: "json",
      contentType: 'application/json',
      processData: false,
      success: function(user) {

        $window.location.href = '/#/boards';

      },
      error: function(error) {
        console.log(error);
      }
    });
      /*
      $.ajax({ 
        type: "POST",
        url: "http://odysseyapistaging.herokuapp.com/api/users",
        data: JSON.stringify({ "username": $scope.username, "password": $scope.password}),
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        processData: false,
        success: function(r) {
          console.log(r);
          console.log(r.username);
        },
        error: function(error) {
          console.log(error);
        }
      });
      */
  }
});