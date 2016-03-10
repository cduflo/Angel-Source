angular.module('starter.controllers', [])

.controller('SignInCtrl', function($rootScope, $state, $scope, API, $window) {
  $scope.validateUser = function () {
    console.log("button clicked");
    $state.go('tab.events');
  }

})
.controller('SignUpCtrl', function($scope) {})
.controller('EventsCtrl', function($rootScope, $state, $stateParams, API, $scope) {
  // $rootScope.$on('fetchAll', function() {
  //   API.getAll().success(function(data, status, headers, config){
  //     $scope.events = data;
  //     console.log(data);
  //   });
  // });
  //
  // $scope.fetch = function() {
  //   API.getAllEvents().success(function(data, status, headers, config){
  //     $scope.events = data;
  //     console.log(data);
  //   });
  // };

  API.getAllEvents().success(function(data, status, headers, config){
    $scope.events = data;
    console.log(data);
  });

  $scope.selection = function(choice) {
    $state.go('tab.events-detail', { myParam: { selection: choice } })
  }
})
.controller('EventsDetailCtrl', function($scope,API, $stateParams) {
    var activate = function () {
    $scope.selection = $stateParams.myParam.selection;
  }
  activate();

  $scope.saveToMyList = function (choice) {
    console.log("ive been clicked");
    API.saveMyList(choice).success(function(data, status, headers, config){
      console.log(data);
    });
  }

})
.controller('MyListCtrl', function($scope, API) {
  API.getAllMyList().success(function(data, status, headers, config){
    $scope.events = data;
    console.log(data);
  });
})
.controller('MyListDetailCtrl', function($scope) {})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
