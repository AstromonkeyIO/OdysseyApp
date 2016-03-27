
var odysseyApp = angular.module('odysseyApp', ['ngRoute']);

// for creating current user session
odysseyApp.factory( 'AuthService', function($http, $q, $rootScope) {
  var currentUser = "yo";

  return {

    getCurrentUser: function() {
        return currentUser;
    },
    setCurrentUser: function(u){
        currentUser = u;
    }
  }
});

odysseyApp.service('UserService', function($http) {
    this.currentUser; 
    this.setCurrentUser = function(user) {
        this.currentUser = user;
    };
    this.getCurrentUser = function() {
        return this.currentUser;
    };
    this.hello = function() {
        return "Hello, World!"
    };
});


odysseyApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
  $routeProvider.when('/', {
    controller: 'testController',
    templateUrl: 'test.html'
  })
  .when('/test2', {
    controller: 'testController',
    templateUrl: 'test.html'
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
  .otherwise({redirectTo: '/'});
  
  $locationProvider.html5Mode(true);

}]);

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