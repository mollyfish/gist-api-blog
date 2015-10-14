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
    .when('/details/:gist_id', {
      templateUrl: 'views/gist/gist_detail.html',
      controller: 'GistController'
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
  });

  app.controller('GistController', function ($scope, $routeParams, dataService) {
    $scope.msg = 'OHAI!';

    dataService.getGistData($routeParams.gist_id).then(function(dataResponse) {
      $scope.gist = dataResponse.data;
    });
  });

  app.controller('GistListController', function($scope, dataService) {
    dataService.getGistList().then(function(dataResponse) {
      $scope.msg = 'GistListController hears you';
      data = dataResponse;
      console.dir("before for", data);
      for (var i = 0; i < data.length; i++) {
        post = {};
        post.id = data[i].id;
        post.url = data[i].html_url;
        post.title = data[i].description;
        post.date = data[i].updated_at;
        post.author = data[i].owner.login;
        post.avatarSrc = data[i].owner.avatar_url;
        post.comments = parseInt(data[i].comments);
        post.files = [];
        for (file in data[i].files) {
          var filename = data[i].files[file].filename;
          post.files.push(filename);
        }
        posts.push(post);
      }
      console.dir(posts);
    });
    this.info = posts;
  });
})();
