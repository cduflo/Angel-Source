angular.module('starter.controllers', [])

.controller('SignInCtrl', function($rootScope, $state, $scope, API, $window) {
  $scope.validateUser = function () {
    console.log("button clicked");
    $state.go('tab.events');
  }

})
.controller('SignUpCtrl', function($scope) {})
.controller('EventsCtrl', function($rootScope, API, $scope) {
  $rootScope.$on('fetchAll', function() {
    API.getAll().success(function(data, status, headers, config){
      $scope.events = data;
      console.log(data);
    });
  });

  $scope.fetch = function() {
    API.getAll().success(function(data, status, headers, config){
      $scope.events = data;
      console.log(data);
    });
  };
})
.controller('EventsDetailCtrl', function($scope) {})
.controller('MyListCtrl', function($scope) {})
.controller('MyListDetailCtrl', function($scope) {})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
