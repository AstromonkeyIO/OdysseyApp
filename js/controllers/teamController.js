odysseyApp.controller('teamController', function ($scope, $routeParams, $compile, currentUserService) 
{   


    $scope.newMemberRole = "nonAdmin";

    $scope.selectAdmin = function() {


        $(".admin-selector").addClass("active");
        $(".non-admin-selector").removeClass("active");
        $scope.newMemberRole = "admin";
    }

    $scope.selectNonAdmin = function() {

        $(".admin-selector").removeClass("active");
        $(".non-admin-selector").addClass("active");
        $scope.newMemberRole = "nonAdmin";
    } 

    $scope.addInviteeToDB = function(email, role) {

        $.ajax({ 
            type: "POST",
            url: "http://odysseyapistaging.herokuapp.com/api/invitee",
            data: JSON.stringify({"email": email, "role": role}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(invitee) {
                console.log(invitee);
                $scope.sendSignupInvite(invitee.email, "bob");
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

    $scope.sendSignupInvite = function(email, sender) {

        $.ajax({ 
            type: "POST",
            url: "http://odysseyapistaging.herokuapp.com/api/mail/invite",
            data: JSON.stringify({"newMemberEmail": email, "inviter": sender}),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(task) {
                $('.invite-button').prop('disabled', false);
                $('.invite-button').html('Invite Sent!').fadeIn();
                setTimeout(function() {
                    $('#invite-member-popup').modal('hide');
                }, 1000);
            },
            error: function(error) {
                console.log(error);
                $('.invite-button').prop('disabled', false);
            }
        });
    }

    $scope.addNewMember = function() {

        $('.invite-button').html('Sending...').fadeIn();
        $('.invite-button').prop('disabled', true);

        $scope.addInviteeToDB($scope.newMemberEmail,  $scope.newMemberRole);

    }

    //left menu bar
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

    //resetting popup when it is closed
    $(document).ready(function()
    {   
        // codes works on all bootstrap modal windows in application
        $('.modal').on('hidden.bs.modal', function(e)
        { 
            $(this).removeData();
            $scope.newMemberEmail = "";
            $scope.$apply();
        });

    });
    //

});