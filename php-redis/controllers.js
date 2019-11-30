var redisApp = angular.module('redis', ['ui.bootstrap']);

const BACKEND = "http://backend-guestbook.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud"

function RedisController() {}

RedisController.prototype.onRedis = function() {
  scope = this.scope_;
  this.http_.get (BACKEND + "/append/" + scope.msg)
    .then(function(data) {
      console.log(data);
      scope.messages = data.data.split(",");
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
            .then(function(data) {
                console.log(data);
                $scope.messages = data.data.split(",");
            }, function(error) {
              console.log(error);
            });
});
