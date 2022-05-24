var redisApp = angular.module('redis', ['ui.bootstrap']);

// const BACKEND = "http://backend-guestbook.patrocinio-ocp43-ddd93d3a0fef01f6b396b69d343df410-0000.us-east.containers.appdomain.cloud";

const BACKEND = "http://backend-guestbook.patrocinio-openshift-7db4ca5a05b33ab7fcab81e11eea210d-0000.us-east.containers.appdomain.cloud";


function RedisController() {
  console.log ("Constructor");
}

RedisController.prototype.onRedis = function() {
  this.http_.get (BACKEND + "/append/" + this.scope_.msg)
    .then(function(result) {
      console.log("Append: ", result);
    }, function(error) {
      console.log (error);
    })
};

function retrieveMessages($scope) {
  console.log ("Retrieving messages...");
  console.log ("Backend: ", BACKEND);
  $scope.controller.http_.get(BACKEND + "/get")
      .then(function(result) {
          console.log("Get: ", result);
          data = result.data.data;
          if (data == null) {
            $scope.messages = ['No messages']  
          } else {
            $scope.messages = data.split(",");
          }
          console.log ("Messages ", $scope.messages);
      }, function(error) {
        console.log(error);
      });
}

redisApp.controller('RedisCtrl', function ($scope, $http, $location) {
        console.log ("Redis controller");
        $scope.controller = new RedisController();
        $scope.controller.scope_ = $scope;
        $scope.controller.location_ = $location;
        $scope.controller.http_ = $http;

        setInterval(() => { retrieveMessages($scope) }, 5000);

});
