'use strict';
/* global _ */

var app = angular.module('moviebuddyApp');

app.service('getMoviesData', function($http){
  var rottenTomatoesUrl = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?callback=JSON_CALLBACK&apikey=63za93cgdtv88ves8p6d9wrk';
  var pageLimitQuery = '&page_limit=';
  var pageQuery = '&page=';
  this.getMovieData = function(queryPage, queryPageLimit) {
    var query = rottenTomatoesUrl + pageLimitQuery + queryPageLimit + pageQuery + queryPage;
    return $http.jsonp(query);
  };
});

app.controller('moviesController', function ($scope, $http, getMoviesData) {
  var totalMovies;
  var totalQueryPages;
  var queryPage = 1;
  var queryPageLimit = 50;

  $scope.allMovies = [];
  $scope.movies;
  $scope.totalPages;
  $scope.morePages = true;
  var pageLimit = 10;
  $scope.page = 1;


  var getMovies = function(queryPage, queryPageLimit) {
    getMoviesData.getMovieData(queryPage, queryPageLimit)
    .then(function(data){
      var rtData = data.data;
      totalMovies = rtData.total;
      totalQueryPages = Math.ceil(totalMovies / queryPageLimit);

      $scope.allMovies = $scope.allMovies.concat(rtData.movies);
      queryPage++;

      if (queryPage <= totalQueryPages) {
        getMovies(queryPage, queryPageLimit);
      }
      if (queryPage === totalQueryPages) {
        $scope.movies = $scope.allMovies.slice(0, pageLimit * $scope.page);
      }
    });
  };

  getMovies(queryPage, queryPageLimit);

  // view more movies
  $scope.viewMore = function() {
    $scope.totalPages = Math.ceil($scope.allMovies.length / pageLimit);
    if ($scope.page + 1 > $scope.totalPages) { return; }
    $scope.movies = $scope.allMovies.slice(0, pageLimit * (++$scope.page));
    if ($scope.page + 1 > $scope.totalPages) {
      $scope.morePages = false;
    }
  };

  $scope.hideViewMoreButton = function(){
    return $scope.morePages;
  };


  // sort movies helper function
  var sortMovies = function(collection, category) {
    if (category.split('.').length > 1) {
      category = category.split('.');
    }

    return collection.sort(function(a, b){
      a[category] = (a[category] === '' && category === 'runtime') ? 0 : a[category];
      a[category] = (a[category] === '' && category === 'runtime') ? 0 : a[category];

      if (Array.isArray(category)) {
        if (b[category[0]][category[1]] < a[category[0]][category[1]]) {
          return -1;
        } else {
          return 1;
        }
        return 0;
      } else {
        if (b[category] < a[category]) {
          return -1;
        } else {
          return 1;
        }
        return 0;
      }
    });
  };

  // sort all movies on button clicks
  $scope.sortAllMovies = function(category){
    $scope.allMovies = sortMovies($scope.allMovies, category);
    $scope.movies = $scope.allMovies.slice(0, pageLimit * $scope.page);
  };

  // reverse the all movies storage
  $scope.reverseAllMovies = function(){
    $scope.allMovies.reverse();
    $scope.movies = $scope.allMovies.slice(0, pageLimit * $scope.page);
  };





  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];

});
