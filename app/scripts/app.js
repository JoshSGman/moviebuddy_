'use strict';

var app = angular.module('moviebuddyApp', ['ngRoute', 'ngCookies', 'xeditable']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      resolve: {
        checkLogin: function(authentication) {
          return authentication.auth();
        }
      }
    })
    .when('/dash', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashController',
      resolve: {
        checkLogin: function(authentication) {
          return authentication.auth();
        }
      }
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

// Authentication service that handles login and logout
app.service('authentication', ['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {
  this.auth = function() {
    return $http.get('/auth/isLoggedIn')
      .then(function (response) {
        if (response.data === 'false') {
          $location.path('/');
        }

        if (window.document.cookie !== '') {
          $rootScope.user = JSON.parse(window.document.cookie.split('=')[0]);
        }
      });
  };
}]);

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));
