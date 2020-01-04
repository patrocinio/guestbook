var redisApp = angular.module('redis', ['ui.bootstrap']);

const BACKEND = "http://XXBACKENDXX";

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
          $scope.messages = result.data.data.split(",");
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
