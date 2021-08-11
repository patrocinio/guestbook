var redisApp = angular.module('redis', ['ui.bootstrap']);

function RedisController() {}

RedisController.prototype.onRedis = function() {
  console.log ("append");

    this.http_.get("guestbook.php?cmd=append&key=messages&value=" + this.scope_.msg)
            .success(angular.bind(this, function(data) {
              console.log(data);
              this.scope_.messages = data.data.split(",");
            }));
};

redisApp.controller('RedisCtrl', function ($scope, $http, $location) {
    console.log ("Initializing");

        $scope.controller = new RedisController();
        $scope.controller.scope_ = $scope;
        $scope.controller.location_ = $location;
        $scope.controller.http_ = $http;

        $scope.controller.http_.get("guestbook.php?cmd=get&key=messages")
            .success(function(data) {
                console.log(data);
                if (data.data) { 
                  $scope.messages = data.data.split(",");
                } else {
                  $scope.messages = "";
                }
            });
});
