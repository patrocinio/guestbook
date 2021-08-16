var redisApp = angular.module('redis', ['ui.bootstrap']);

const BACKEND = "http://backend-guestbook.patrocinio-684-ddd93d3a0fef01f6b396b69d343df410-0000.us-south.containers.appdomain.cloud"

function RedisController() {}

RedisController.prototype.onRedis = function() {
  scope = this.scope_;
  this.http_.get (BACKEND + "/append/" + scope.msg)
    .then(function(result) {
      console.log("Append: ", result);
      scope.messages = result.data.data.split(",");
    }, function(error) {
      console.log (error);
    })
};

redisApp.controller('RedisCtrl', function ($scope, $http, $location) {
        $scope.controller = new RedisController();
        $scope.controller.scope_ = $scope;
        $scope.controller.location_ = $location;
        $scope.controller.http_ = $http;

        $http.get(BACKEND + "/get")
            .then(function(result) {
                console.log("Get: ", result);
                $scope.messages = result.data.data.split(",");
            }, function(error) {
              console.log(error);
            });
});
