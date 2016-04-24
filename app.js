
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

    $routeProvider.when('/', {
        controller: 'loginController',
        templateUrl: '/html/login.html'
    })
    .when('/login', {
        controller: 'loginController',
        templateUrl: '/html/login.html'
    })
    .when('/signup', {
        controller: 'signupController',
        templateUrl: '/html/signup.html'
    })
    .when('/boards', {
        controller: 'boardsController',
        templateUrl: '/html/boards.html'
    })
    .when('/boards/:boardId', {
        controller: 'workflowController',
        templateUrl: '/html/workflow.html'
    })
    .when('/boards/:boardId/:taskId', {
        controller: 'workflowController',
        templateUrl: '/html/workflow.html'
    })
    .when('/team/', {
        controller: 'teamController',
        templateUrl: '/html/team.html'
    })
    .when('/report/', {
        controller: 'reportController',
        templateUrl: '/html/report.html'
    })
    .otherwise({redirectTo: '/login'});

    //$locationProvider.html5Mode(true);

}]).run( function($rootScope, $location, currentUserService, $document, $cookies, $route) {

    var cookies = $cookies;
    $rootScope.$on("$routeChangeStart", function(event, next, currentUserService, $cookies) {

        if(cookies.currentUser == "") {
        
            $location.path( "/login" );

        }
    });
       
});


//odysseyApp.controller(controllers)