odysseyApp.controller('loginController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService, $cookies) {

    $scope.displaySignupForm = function() {

        $('#login-box').css('display', 'none');
        $('#signup-box').css('display', 'block');  

    }

    $scope.displayLoginForm = function() {

        $('#signup-box').css('display', 'none'); 
        $('#login-box').css('display', 'block');

    }

    $scope.submit = function() {

        $('#login-button').prop('disabled', true);
        $('#login-button').html('Logging in').fadeIn();

        $.ajax({ 
            type: "GET",
            url: "https://odysseyapistaging.herokuapp.com/api/users/"+ $scope.username +"/" + $scope.password,
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

    };

    $scope.signupUser = function() {

        $('#signup-button').prop('disabled', true);
        $('#signup-button').html('Creating Your Profile!').fadeIn();

        $.ajax({ 
            type: "PUT",
            url: "https://odysseyapistaging.herokuapp.com/api/invitee",
            data: JSON.stringify({"email": $scope.signupEmail, "username": $scope.signupUsername, "password": $scope.signupPassword, "title": $scope.signupTitle}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(user) {
                console.log(user);

                if(typeof(user.error) != 'undefined') {

                    $('#signup-button').prop('disabled', false);
                    $('#signup-button').html(user.error).fadeIn();
                    $('#signup-button').css('background-color', '#d9534f');
                    $('#signup-button').css('border-color', '#d9534f');
                    setTimeout(function() {
                        $('#signup-button').html('Sign Up!').fadeIn();
                        $('#signup-button').css('background-color', '#449d44');
                        $('#signup-button').css('border-color', '#449d44');
                    }, 1000); 

                } else {

                    console.log(user);
                    $cookies.currentUser = JSON.stringify(user);
                    $('#signup-button').prop('disabled', false);
                    $('#signup-button').html('Profile Created!').fadeIn();
                    setTimeout(function() {
                        $location.path("/boards");
                        $scope.$apply();
                    }, 700); 

                }
            },
            error: function(error) {

                $('#signup-button').prop('disabled', false);
                $('#signup-button').html('Signup Failed!').fadeIn();
                $('#signup-button').css('background-color', '#d9534f');
                $('#signup-button').css('border-color', '#d9534f');
                setTimeout(function() {
                    $('#signup-button').html('Sign Up!').fadeIn();
                    $('#signup-button').css('background-color', '#449d44');
                    $('#signup-button').css('border-color', '#449d44');
                }, 1000);

            }
        });

    };

});
