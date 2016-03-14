angular.module('starter.controllers', [])

.controller('LandingCtrl', function($state, $scope, $network, $localstorage) {
$scope.open = function () {
    $network.getIP();
    if (typeof $localstorage.get('user.email') != "undefined") {
      $state.go('tab.events');
    } else {
      $state.go('auth.signup');
    }
}

})


.controller('SignInCtrl', function($rootScope, $state, $scope, $localstorage, $network, API, $window) {
  $scope.user = {
    email: ""
  }
  $scope.validateUser = function () {
    $localstorage.set('user.email', $scope.user.email);
    console.log("button clicked");
    $state.go('tab.events');
  }

//   $scope.login = function() {
//     $cordovaOauth.facebook("1173863462625566", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
//         $localStorage.accessToken = result.access_token;
//         $location.path("/tab/dash");
//     }, function(error) {
//         alert("There was a problem signing in!  See the console for logs");
//         console.log(error);
//     });
// };
})


.controller('SignUpCtrl', function($scope, $state) {
  $scope.createUser = function () {
    console.log("button clicked");
    $state.go('auth.signin');
  }
})


.controller('TabsCtrl', function ($scope, $state){
  $scope.goTo= function(state){
    $state.go(state);
  }

})


.controller('EventsCtrl', function($rootScope, $state, $stateParams, API, $scope) {
  // $volunteer.doApiCall();
  API.getAllEvents().success(function(data, status, headers, config){
    $scope.events = data;
    console.log(data);
  });

  $scope.selection = function(choice) {
    $state.go('tab.events-detail', { myParam: { selection: choice } })
  }
})


.controller('EventsDetailCtrl', function($scope, $state, API, $localstorage, $stateParams) {
    var activate = function () {
    $scope.selection = $stateParams.myParam.selection;
  }
  activate();

  $scope.saveToMyList = function (choice) {
    console.log("ive been clicked");
    choice.email = $localstorage.get('user.email');
    API.saveMyList(choice, $localstorage.get('user.email')).success(function(data, status, headers, config){
      console.log(data);
    });
    $state.go('tab.events');
  }

})


.controller('MyListCtrl', function($scope, $state, $localstorage, API) {
  API.getAllMyList($localstorage.get('user.email')).success(function(data, status, headers, config){
    $scope.events = data;
    console.log(data);
  });

  $scope.selection = function(choice) {
    $state.go('tab.mylist-detail', { myParam: { selection: choice } })
  }
})


.controller('MyListDetailCtrl', function($scope, $state, API, $stateParams) {
  var activate = function () {
  $scope.selection = $stateParams.myParam.selection;
  }
  activate();

$scope.deleteFromMyList = function (choice) {
  console.log("i've been clicked!");
  API.deleteMyList(choice._id).success(function(data, status, headers, config){
    console.log(data);
    $state.go('tab.mylist');
  });
}
})


.controller('AccountCtrl', function($scope, $localstorage) {
  // $scope.settings = {
  //   enableFriends: true
  // };
  $scope.userzip = $localstorage.get('user.Zip');
  $scope.radius = 10;
  $scope.timeframe = "this_week";
});
