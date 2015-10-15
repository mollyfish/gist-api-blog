require('angular');
require('angular-route');

(function() {
  var app = angular.module('blog',['ngRoute', 'blog.config']);

  var post;
  var posts = [];
  var data;
  var part1 = '9e036a59681409c5f542';
  var part2 = '72e86d69d37a005ad650';

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
      }

    this.getGistData = function (gistId) {
      return $http({
        method: 'GET',
        url: 'https://api.github.com/gists/' + gistId,
        headers: {'Authorization': 'token ' + part1 + part2}
      });
    };

    this.createNewGist = function() {
      console.log('new gist has fired');
    //   var res = $http.post('https://api.github.com/gists/', newGist, headers: { 'Authorization': 'token ' + part1 + part2 });

    //   res.success(function(data, status, headers, config) {
    //     $scope.message = data;
    //   });
    //   res.error(function(data, status, headers, config) {
    //     alert( "failure message: " + JSON.stringify({data: data}));
    //   });
    }
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

  app.controller('GistFormController', function($scope, dataService) {
    $scope.msg = 'A form!  Sa-weet!';
    $scope.submit = dataService.createNewGist().then(function(){
      console.log('submission');
    });
    var newGistDesc = document.getElementById('description').value;
    var newGistFilename = document.getElementById('filename').value;
    var newGistFileContent = document.getElementById('content').value;
    console.log(newGistDesc);
    console.log(newGistFilename);
    console.log(newGistFileContent);
    var newGist = { "description": newGistDesc,
      "public": true,
      "files": {
        newGistFilename: { "content": newGistFileContent }
      }
    };
  });
})();
