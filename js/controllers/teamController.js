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

    $scope.getAllUsers = function() {

        $.ajax({ 
            type: "GET",
            url: "http://odysseyapistaging.herokuapp.com/api/users",
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            processData: false,
            success: function(users) {

                console.log(users);
                var html = '';
                for(var i = 0; i < users.length; i++) {

                    if(typeof(users[i].username) != 'undefined') {
                        //html = html + '<div class="col-lg-4 col-md-4 col-sm-5 col-xs-12 profile">'+'<div class="img-box">'+'</div>'+'<img src="http://placehold.it/60x60">'+'<h1>' + users[i].username + '</h1>' +'<h2>Co-founder/ Operations</h2>'+
                        //'<p></p>'+
                        //'</div>';
                        html = html + '<div class="col-lg-4 col-md-4 col-sm-5 col-xs-12 profile">'+
                        '               <div class="img-box">'+
                        '               </div>'+
                        '                   <img src="http://placehold.it/60x60">'+
                        '               <h1>' +  users[i].username + '</h1>'+
                        '               <h2>Co-founder/ Operations</h2>'+
                        '               <div id="'+ users[i]._id +'" class="user-buttons">'+
                        '                   <button type="button" class="btn btn-success">'+
                        '                       <span class="glyphicon glyphicon-envelope" aria-hidden="true" ng-click="emailUser()"></span> Message'+
                        '                   </button>'+
                        '                   <button type="button" class="btn btn-danger remove-user-button" value="'+ users[i]._id +'">'+
                        '                       <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Remove'+
                        '                   </button>'+
                        '               </div>'+
                        '            </div>';
                    }

                }

                $('.user-display-box').html(html);

            },
            error: function(error) {
                console.log(error);
            }
        });


    }

    // remove user
    $(document).on("click", ".remove-user-button", function(){
        //$(this).parent().remove();
        //$('#delete-user-popup').modal('show');
        console.log($(this).parent()[0].id);
        alert ('button clicked' + $(".remove-user-button").val() + $(this).parent());


    });

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

    $scope.getAllUsers();



});