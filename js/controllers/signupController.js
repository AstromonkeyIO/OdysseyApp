odysseyApp.controller('signupController', function($rootScope, $scope, $location, $document, $cookieStore, currentUserService) {


    $scope.convertInviteeToUser = function(email, username, password, title) {

        $.ajax({ 
            type: "PUT",
            url: "http://odysseyapistaging.herokuapp.com/api/invitee",
            data: JSON.stringify({"email": email, "username": username, "password": password, "title": title}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(user) {
                console.log(user);
                $('.invite-button').prop('disabled', false);
                $('.invite-button').html('Profile Created!').fadeIn();
                setTimeout(function() {
                    $('.invite-button').html('Try again').fadeIn();
                }, 1000);                
            },
            error: function(error) {
                console.log(error);
                $('.invite-button').prop('disabled', false);
                $('.invite-button').html('Something went wrong!').fadeIn();
                setTimeout(function() {
                    $('.invite-button').html('Try again').fadeIn();
                }, 1000);

            }
        });

    }

    $scope.signupUser = function() {

        $('.signup-button').prop('disabled', true);
        $('.signup-button').html('Sending...').fadeIn();

        $scope.convertInviteeToUser($scope.email, $scope.username, $scope.password, $scope.title);   
    }

});
