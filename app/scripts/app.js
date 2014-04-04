'use strict';

angular
  .module('moviebuddyApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashController'
      })
      .otherwise({
        redirectTo: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginController'
      });
  });

