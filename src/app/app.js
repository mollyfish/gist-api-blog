require('angular');
require('angular-route');

(function () {
  'use strict';
  var app = angular.module('blog',['ngRoute', 'blog.config']);
  // var data;
  var part1 = '9e036a59681409c5f542';
  var part2 = '72e86d69d37a005ad650';
  var newGist = {};

  app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/gists/gist_preview.html',
      controller: 'GistListController'
    })
    .when('/detail/:g_id', {
      templateUrl: 'views/gist/gist_detail.html',
      controller: 'GistController'
    })
    .when('/new/:g_id/edit', {
      templateUrl: 'views/gist/gist_form.html',
      controller: 'GistFormController'
    })
    .when('/new', {
      templateUrl: 'views/gist/gist_form.html',
      controller: 'GistFormController'
    });
  });

  app.service('dataService', function($http, token) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getGistList = function() {
        return $http({
            method: 'GET',
            url: 'https://api.github.com/users/mollyfish/gists',
            headers: {'Authorization': 'token ' + part1 + part2}
        }).then(function(resp, err) {
          return resp.data;
        });
      };

    this.getGistData = function (gistId) {
      return $http({
        method: 'GET',
        url: 'https://api.github.com/gists/' + gistId,
        headers: {'Authorization': 'token ' + part1 + part2}
      });
    };

    this.createNewGist = function() {
      var res = $http.post('https://api.github.com/gists/', newGist, {
        headers: { 'Authorization': 'token ' + part1 + part2 }
      });
      res.success(function(data, status, headers, config) {
        $scope.message = data;
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });
    };

    this.updateGist = function (gistId) {
      return $http.put('http://localhost:9000/#/detail/' + gistId);
    };
  });

  app.controller('GistListController', function($scope, dataService) {
    $scope.msg = 'GistListController hears you';
    dataService.getGistList().then(function(dataResponse) {
      $scope.gist = dataResponse;
    });
  });

  app.controller('GistController', function ($scope, $routeParams, dataService) {
    $scope.msg = 'OHAI!';
    dataService.getGistData($routeParams.g_id).then(function(dataResponse) {
      $scope.gist = dataResponse.data;      
    });
  });

  app.controller("GistFormController", ['$scope', "dataService", "$routeParams", "$location", function ($scope, dataService, $routeParams, $location) {

    $scope.save = saveForm;  //'saveForm' is out of scope.

    $scope.gist = {};

    initialize();  //'initialize' is out of scope.

    function initialize () {
      if ($routeParams.g_id) {
        dataService.getGistData($routeParams.g_id).then(function (resp) {
          $scope.gist = resp.data;
        });
      }
    }

    function saveForm () {
      console.log('saveForm has fired');
      
      $scope.gist.description = document.getElementById('description').value;
      $scope.gist.fileName = document.getElementById('filename').value;
      $scope.gist.fileContent = document.getElementById('content').value;
      newGist = { "description": $scope.gist.description,
        "public": true,
        "files": {
          "newfile-1.txt": {
            "filename": $scope.gist.fileName,
            "content": $scope.gist.fileContent
          }
        }
      };
      var method = $routeParams.g_id ? "updateGist(g_id)" : "createNewGist";
      dataService[method]($scope.gist).then(function (resp) {
        $location.path("/gists/" + resp.data._id); //Bad property name '_id'.
      });
    }
  }]);
})();
