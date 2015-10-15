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
    .when('/detail/:g_id/edit', {
      templateUrl: 'views/gist/edit_gist_form.html',
      controller: 'GistFormController'
    })
    .when('/detail/:g_id/delete', {
      templateUrl: 'views/gists/gist_preview.html',
      controller: 'GistDeleteController'
    })
    .when('/new', {
      templateUrl: 'views/gist/new_gist_form.html',
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

    this.createNewGist = function(newGist) {
      return $http.post('https://api.github.com/gists', newGist, {
        headers: { 'Authorization': 'token ' + part1 + part2 }
      });
    };

    this.updateGist = function (newGist, gistId) {
      return $http.patch('https://api.github.com/gists/' + gistId, newGist, {
        headers: { 'Authorization': 'token ' + part1 + part2 }
      });
    };

    this.deleteGist = function (gistId) {
      return $http.delete('https://api.github.com/gists/' + gistId, {
        headers: { 'Authorization': 'token ' + part1 + part2 }
      });
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
      console.dir($scope.gist);     
    });
  });

  app.controller('GistDeleteController', function ($scope, $routeParams, dataService, $location) {
    $scope.msg = 'I is here!';
    dataService.deleteGist($routeParams.g_id).then(function(dataResponse) {
      $location.path("/");
      // $scope.gist = dataResponse.data;      
    });
  });

  app.controller("GistFormController", ['$scope', "dataService", "$routeParams", "$location", function ($scope, dataService, $routeParams, $location) {

    $scope.saveNew = saveNewForm;
    $scope.saveEdits = saveEditsForm;  //'saveForm' is out of scope.

    $scope.gist = {};

    initialize();  //'initialize' is out of scope.

    function initialize () {
      if ($routeParams.g_id) {
        dataService.getGistData($routeParams.g_id).then(function (resp) {
          $scope.gist = resp.data;
        });
      }
    }

    function saveNewForm () {
      console.log('saveNew has fired');
      $scope.gist.description = document.getElementById('description').value;
      var filename = document.getElementById('filename').value;
      var content1 = document.getElementById('content1').value;
      $scope.gist.files = {};
      $scope.gist.files[filename] = {content: content1, filename: filename + '.txt'}; 
      
      newGist = {
        "description": $scope.gist.description,
        "public": true,
        "files": $scope.gist.files
      };
      var method = $routeParams.g_id ? "updateGist" : "createNewGist";
      dataService[method](newGist, $routeParams.g_id).then(function (resp) {
        $location.path("/detail/" + resp.data.id); //Bad property name '_id'.
        console.log(resp.data.id);
        console.log(resp);
      });
    }

    function saveEditsForm () {
      console.log('saveEdits has fired');


      $scope.gist.description = document.getElementById('description').value;
      $scope.gist.updatedContent = document.getElementById('updContent').value;
      $scope.gist.newFilename = document.getElementById('filename').value;
      $scope.gist.modContent = document.getElementById('modContent').value;
      $scope.gist.newContent = document.getElementById('newContent').value;
      // newGist = { 
      //   "description": $scope.gist.description,
      //   "files": {

      //     // "file1.txt": {
      //     //   "content": $scope.gist.updatedContent },

      //     // "old_name.txt": {
      //     //   "filename": $scope.gist.newFilename,
      //     //   "content": $scope.gist.modContent
      //     // },

      //     // "new_file.txt": {
      //     //   "content": $scope.gist.newContent
      //     // },

      //     "delete_this_file.txt": null
      //   }
      // };
      var method = $routeParams.g_id ? "updateGist" : "createNewGist";
      dataService[method]($routeParams.g_id).then(function (resp) {
        $location.path("/gists/" + $routeParams.g_id);
        // console.log(resp.data.id);
        console.log(resp);
      });
    }

  }]);
})();
