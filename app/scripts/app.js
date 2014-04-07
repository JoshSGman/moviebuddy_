'use strict';
/* global FB */

var app = angular.module('moviebuddyApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'loginController'
    })
    .when('/dash', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginController'
    })
    .when('/api/friends', {
      templateUrl: 'views/friends.html',
      controller: 'friendsController'
    })
    .otherwise({
      redirectTo: '/',
      templateUrl: 'views/login.html',
      controller: 'loginController'
    });
});

app.run(function($rootScope, $location) {
  $rootScope.loggedIn = false;

  window.fbAsyncInit = function() {
    FB.init({
      appId: '1391051064505902'
    });
  };

  $rootScope.$watch('loggedIn', function(){
    if ($rootScope.loggedIn === true) {
      $location.path('/dash');
    } else {
      $location.path('/');
    }
  });

});

app.service('authentication', function($rootScope) {

  this.fbLogin = function(){
    FB.login(function(response){
      if (response.authResponse){
        // attach user object to the rootscope
        FB.api('/me', function(response){
          $rootScope.me = response;
          $rootScope.loggedIn = true;
          $rootScope.$apply();
        });

        // get user's friends array on login and store them all in a hash
        FB.api('/me/friends', function(friends){
          $rootScope.me.friends = [];
          for (var i = 0; i < friends.data.length; i++){
            $rootScope.me.friends.push(friends.data[i].id);
          }
          $rootScope.$apply();
        });

        FB.api('/me/picture', function(photo){
          console.log(photo);
        });

      }
    });
  };

  this.fbLogout = function(){
    FB.logout(function() {
      $rootScope.loggedIn = false;
      $rootScope.$apply();
    });
  };

});


// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

