require('angular');
require('angular-route');

(function() {
  var app = angular.module('blog',[]);
  var post;
  var data;

  app.service('dataService', function($http) {
  delete $http.defaults.headers.common['X-Requested-With'];
  this.getData = function() {
      return $http({
          method: 'GET',
          url: 'https://api.github.com/users/mollyfish/gists',
          params: 'limit=10, sort_by=created:desc',
          headers: {'Authorization': 'token 948fb121b125ea1cc0e203cdc2616732dc7e3555'}
      }).then(function(resp, err) {
        return resp.data;
      });
    }
  });
  
  app.controller('GistController', function($scope, dataService) {
    post = {};
    dataService.getData().then(function(dataResponse) {
      var data = dataResponse;
      for (var i = 0; i < data.length; i++) {
        post.description = data[i].description;
        post.date = data[i].updated_at;
        post.author = data[i].owner.login;
        for (file in data[i].files) {
          post.title = data[i].files[file].filename;
        }
      }
      return(data);
    });
    this.info = post;
  });
})();
