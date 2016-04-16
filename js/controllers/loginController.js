odysseyApp.controller('loginController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService) {

    $scope.submit = function() {

        $.ajax({ 
            type: "GET",
            url: "http://odysseyapistaging.herokuapp.com/api/users/"+ $scope.username +"/" + $scope.password,
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            headers : {'Content-Type':undefined,},
            success: function(user) {

            $rootScope.currentUser = user; 

            $cookieStore.put('currentUser', user);
            var d = new Date();
            d.setTime(d.getTime() + (1*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            $document.cookie = "currentUser"+ "=" + JSON.stringify(user) + "; " + expires;
            //$document.cookie = user;
            currentUserService.setCurrentUser(user);
            //console.log($document.cookie);
            $location.path("/boards");
            $scope.$apply();

            },
            error: function(error) {
                console.log(error);
            }
        });

    }
});
