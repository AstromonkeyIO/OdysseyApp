
var odysseyApp = angular.module('odysseyApp', ['ngRoute']);

odysseyApp.service('currentUserService', function(){
    this.currentUser = {};

    this.setCurrentUser = function(user) {
        this.currentUser = user;
    }

    this.getCurrentUser = function() {
        return this.currentUser;
    }
});

odysseyApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){

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