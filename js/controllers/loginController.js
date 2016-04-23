odysseyApp.controller('loginController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService, $cookies) {

    $scope.submit = function() {

        $('#login-button').prop('disabled', true);
        $('#login-button').html('Logging in').fadeIn();

        $.ajax({ 
            type: "GET",
            url: "http://odysseyapistaging.herokuapp.com/api/users/"+ $scope.username +"/" + $scope.password,
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            headers : {'Content-Type':undefined,},
            success: function(user) {
 
            console.log(JSON.stringify(user));
            $cookies.currentUser = JSON.stringify(user);
            var d = new Date();
            d.setTime(d.getTime() + (1*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            $document.cookie = "currentUser"+ "=" + JSON.stringify(user) + "; " + expires;
            currentUserService.setCurrentUser(user);

            $('#login-button').prop('disabled', false);
            $('#login-button').html('Login Success!').fadeIn();
            setTimeout(function() {
                $location.path("/boards");
                $scope.$apply();
            }, 700);

            },
            error: function(error) {
                $('#login-button').prop('disabled', false);
                $('#login-button').html('Login Failed!').fadeIn();
                $('#login-button').css('background-color', '#d9534f');
                $('#login-button').css('border-color', '#d9534f');
                setTimeout(function() {
                    $('#login-button').html('Login').fadeIn();
                    $('#login-button').css('background-color', '#449d44');
                    $('#login-button').css('border-color', '#449d44');
                }, 700);

            }
        });

    }
});
