/**
 * Copyright 2016 The Kubernetes Authors All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var redisApp = angular.module('redis', ['ui.bootstrap']);

const BACKEND = "http://backend-guestbook.patrocinio-openshift-7db4ca5a05b33ab7fcab81e11eea210d-0000.us-east.containers.appdomain.cloud"

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