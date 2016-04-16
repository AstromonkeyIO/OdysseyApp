
var odysseyApp = angular.module('odysseyApp', ['ngRoute', 'ngCookies']);

odysseyApp.service('currentUserService', function($rootScope, $document){
    this.currentUser = {};

    this.setCurrentUser = function(user) {
        this.currentUser = user;
        $document.cookies = true;
    }

    this.getCurrentUser = function() {
        return this.currentUser;
    }
});

odysseyApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    // Expose XHR requests to server
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider.when('/', {
        controller: 'loginController',
        templateUrl: '/html/login.html'
    })
    .when('/login', {
        controller: 'loginController',
        templateUrl: '/html/login.html'
    })
    .when('/boards', {
        controller: 'boardsController',
        templateUrl: '/html/boards.html'
    })
    .when('/boards/:boardId', {
        controller: 'workflowController',
        templateUrl: '/html/workflow.html'
    })
    .otherwise({redirectTo: '/login'});

    $locationProvider.html5Mode(true);

}]).run( function($rootScope, $location, currentUserService, $document) {

    $rootScope.$on( "$routeChangeStart", function(event, next, currentUserService) {
        console.log("im here");
        
        //console.log("user logged" +$rootScope.loggedInUser);
        if($document.cookies == true) {
            console.log("loggedin");

        } else {
            console.log("i'm loggedout")
            //$location.path( "/login" );           
        }
        /*
        if($rootScope.currentUserService.getCurrentUser()._id == null ) {
            console.log("its null");
            //$location.path( "/login" );
        }
        */
    });        
 });

$(document).ready(function() {
    $("[rel='tooltip'], .tooltip").tooltip();
});

$(function () {
    $('.list-group-item > .show-menu').on('click', function(event) {
    event.preventDefault();
    $(this).closest('li').toggleClass('open');
  });
});

var controllers = {};
controllers.testController = function($scope){
   $scope.first = "Info";
    $scope.customers=[
        {name:'jerry',city:'chicago'},
        {name:'tom',city:'houston'},
        {name:'enslo',city:'taipei'}
    ];
}

odysseyApp.controller(controllers)