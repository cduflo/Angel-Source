angular.module('starter.controllers', ['ionic', 'ngCordovaOauth'])

.controller('LandingCtrl', function($state, $scope, $network, $localstorage, $cordovaOauth, $http) {
    $network.getIP();
    if (typeof $localstorage.get('user.id') != "undefined") {
      $state.go('tab.events');
    }

$scope.facebook = function() {
    $cordovaOauth.facebook("1173863462625566", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
        $localstorage.set('fbOauthToken', result.access_token);
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, fields: "id, first_name,email,location,picture", format: "json" }}).then(function(result2) {
        $localstorage.set('user.name', result2.data.first_name);
        $localstorage.set('user.id', result2.data.id);
        $localstorage.set('user.email', result2.data.email);}, function(e){alert(e)});
        //var picture = result.data.picture;
        // $location.path("/tab/dash");
    }, function(error) {
        alert("There was a problem signing in!  See the console for logs");
        console.log(error);
    });
    };
    
    $scope.google = function () {
        console.log("I've been clicked!");
       $cordovaOauth.google("1090639021269-o87cav3hut98lnse9lbjiovk9krj3cae.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
       console.log(JSON.stringify(result));
       $localstorage.set('gOauthToken', result.access_token);
                    $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token).then(function(result2) {
        $localstorage.set('user.name', result2.data.given_name);
        $localstorage.set('user.id', result2.data.id);
        $localstorage.set('user.email', result2.data.email);
        console.log(result2);
                    }, function(e){alert(e)});
        }, function(error) {
            console.log(error);
        });
    };

})


.controller('SignInCtrl', function($rootScope, $state, $scope, $localstorage, $location, $network, API, $window, $cordovaOauth, $http) {

  $scope.validateUser = function () {
    $localstorage.set('user.email', $scope.user.email);
    console.log("button clicked");
    $state.go('tab.events');
  }

  $scope.facebook = function() {
    $cordovaOauth.facebook("1173863462625566", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
        $localstorage.set('fbOauthToken', result.access_token);
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, fields: "id, first_name,email,location,picture", format: "json" }}).then(function(result2) {
        $localstorage.set('user.name', result2.data.first_name);
        $localstorage.set('user.id', result2.data.id);
        $localstorage.set('user.email', result2.data.email);}, function(e){alert(e)});
        //var picture = result.data.picture;
        // $location.path("/tab/dash");
    }, function(error) {
        alert("There was a problem signing in!  See the console for logs");
        console.log(error);
    });
    };
    
    $scope.google = function () {
        console.log("I've been clicked!");
       $cordovaOauth.google("1090639021269-o87cav3hut98lnse9lbjiovk9krj3cae.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
       console.log(JSON.stringify(result));
       $localstorage.set('gOauthToken', result.access_token);
                    $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token).then(function(result2) {
        $localstorage.set('user.name', result2.data.given_name);
        $localstorage.set('user.id', result2.data.id);
        $localstorage.set('user.email', result2.data.email);
        console.log(result2);
                    }, function(e){alert(e)});
        }, function(error) {
            console.log(error);
        });
    };

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
