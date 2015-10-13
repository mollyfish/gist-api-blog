require('angular');
require('angular-route');

(function() {

var app = angular.module('blog',[]);
var post;

// app.config(function($routeProvider) {
//   $routeProvider.when() // look familiar?!?!
//   console.log('config!');
// });

app.config(function() {
  // console.log('config!');
});

app.run(function() {
  // console.log('run!');
});

app.service('dataService', function($http) {
delete $http.defaults.headers.common['X-Requested-With'];
this.getData = function() {
    // $http() returns a $promise that we can add handlers with .then()
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
    $scope.data = dataResponse;
    for (var i = 0; i < $scope.data.length; i++) {
      post.description = $scope.data[i].description;
      post.date = $scope.data[i].updated_at;
      post.author = $scope.data[i].owner.login;
      for (file in $scope.data[i].files) {
        post.title = $scope.data[i].files[file].filename;
      }
    }
    return(post);
  });
  this.info = post;
});


})();



// var app = angular.module("blog", ["ngRoute"]);

// app.controller('GistController', function() {
//   this.file = post;
// })
//Adapted from work by Prashant kiran
//Date: 1/2/2015
//Github Link : www.github.com/prasht63/Github_Gists
// var token = "948fb121b125ea1cc0e203cdc2616732dc7e3555";
// var post = {};
//Main driver function
// function getGist() {

// 	var result,request;
//   request = new XMLHttpRequest();  
//   $http.get("https://api.github.com/users/mollyfish/gists", {
//     headers: {
//       "Authorization": token,
//     }
//   }).then(function(resp) {
//     console.log(resp);
//   })
// };


	// request.onreadystatechange = function() {
	// 	if (request.readyState == 4 && request.status == 200) {
	// 		result = JSON.parse(request.responseText); 
 //      post = {};
	// 		for (var i = 0; i < result.length; i++) {
 //        post.description = result[i].description;
 //        //
 //        console.log(post.description);
 //        post.author = result[i].owner.login;
 //        //
 //        console.log(post.author);
 //        post.files = result[i].files;
 //        for (file in post.files) {
 //          post.title = post.files[file].filename;
 //          //
 //          console.log(post.title);
 //        }
	//     }
 //      return post;
	//   }   
	// }		

// window.getGist = getGist;
// getGist();
