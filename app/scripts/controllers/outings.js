'use strict';
/* global angular */

var app = angular.module('moviebuddyApp');

app.controller('OutingsController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

  var newOutingButtonVisible = true;
  var newOutingFormVisible = false;

  // Rewrite using angular.forEach()?
  var clearOutingForm = function() {
    $scope.form.movie = '';
    $scope.form.date = '';
    $scope.form.theater = '';
    // $scope.form.invitees = '';
  };

  // Function to create new 'outing' object from form and user.
  var createOuting = function(form, userId, userName) {
    if(form === undefined || userId === undefined || userName === undefined) {
      throw new Error('Insufficient input for function.');
    }
    var outing = {};
    outing.movie = form.movie;
    outing.date = form.date;
    outing.theater = form.theater;
    // Look up below values via TMS or Fandango API or app DB.
    // outing.address;    // outing.city;    // outing.state;    // outing.zip;
    // Postpone invitation funcationality for post-MVP.
    // outing.invitees = form.invitees;
    outing.attendeeIds = [userId];
    outing.attendeeNames = [userName, 'Alice Addams', 'Bob Buckman'];
    // *** TO-DO: Access by userId instead of userName.
    outing.creatorId = userId;
    outing.creatorName = userName;
    return outing;
  };

  // Define empty object to hold form data.
  $scope.form = {};

  $scope.showNewOutingButton = function() {
    return newOutingButtonVisible;
  };

  $scope.showNewOutingForm = function() {
    return newOutingFormVisible;
  };

  // Function to hide 'new outing' button & show 'new outing' form.
  $scope.newOuting = function() {
    newOutingButtonVisible = false;
    newOutingFormVisible = true;
  };

  // Function to hide 'new outing' form & show 'new outing' button.
  $scope.cancelNewOuting = function() {
    newOutingFormVisible = false;
    newOutingButtonVisible = true;
  };

  // Function to process 'new outing' form.
  $scope.processOutingForm = function() {
    var form = $scope.form;
    var userId = $rootScope.user.facebookId;
    var userName = $rootScope.user.name;
    var outing = createOuting(form, userId, userName);
    $http({
      method: 'POST',
      url: '/api/outings',
      data: outing
    })
    .success(function(data) {
      console.log('POST Success:', data);
      clearOutingForm();
      // Hide 'new outing' form, show 'new outing' button.
      newOutingFormVisible = false;
      newOutingButtonVisible = true;
      // Refresh the 'outings' display.
      $scope.getOutings(userId);
    })
    .error(function(data, status, headers, config) {
      console.log('POST Error:', data, status, headers, config);
    });
  };

  // Function to pull from DB 'outings' for user.
  $scope.getOutings = function(userId) {
    if(userId === undefined) {
      throw new Error('Insufficient input for function.');
    }
    $http({
      method: 'GET',
      url: '/api/outings'
    })
    .success(function(data) {
      console.log('GET Success:', data);
      $scope.outings = data;
    })
    .error(function(data, status, headers, config) {
      console.log('GET Error:', data, status, headers, config);
    });
  };

  $scope.showJoinButton = function() {
    var userId = $rootScope.user.facebookId;
    // *** Refactor attendee list to be an object, not an array?
    for(var i = 0; i < this.outing.attendeeIds.length; i++) {
      if(this.outing.attendeeIds[i] === userId) {
        return false;
      }
    }
    return true;
  };

  $scope.joinOuting = function() {
    var userId = $rootScope.user.facebookId;
    var userName = $rootScope.user.name;
    var outing = this.outing;
    outing.attendeeIds.push(userId);
    outing.attendeeNames.push(userName);
  };

  // Initialize display of outings.
  $scope.getOutings($rootScope.user.facebookId);

}]);
