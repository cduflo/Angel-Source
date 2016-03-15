angular.module('starter.controllers', ['ionic', 'ngCordovaOauth'])

.controller('LandingCtrl', function($state, $scope, $network, $localstorage, $cordovaOauth, $http) {
    $network.getIP();

    if (typeof $localstorage.get('user.id') != "undefined") {
        $state.go('tab.events');
    }


$scope.facebook = function() {
$cordovaOauth.facebook("1173863462625566", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"})
    .then(function(result) {
        $localstorage.set('fbOauthToken', result.access_token);
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, 
            fields: "id, first_name,email,location,picture", format: "json" }}).then(function(result2) {
                $localstorage.set('user.name', result2.data.first_name);
                $localstorage.set('user.id', result2.data.id);
                $localstorage.set('user.email', result2.data.email);}, function(e){alert(e)});
                //var picture = result.data.picture;
                $state.go('tab.events');
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };

$scope.google = function () {
    console.log("I've been clicked!");
    $cordovaOauth.google("1090639021269-o87cav3hut98lnse9lbjiovk9krj3cae.apps.googleusercontent.com", 
        ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
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


// .controller('SignInCtrl', function($rootScope, $state, $scope, $localstorage, $location, $network, API, $window, $cordovaOauth, $http) {

//   $scope.facebook = function() {
//     $cordovaOauth.facebook("1173863462625566", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
//         $localstorage.set('fbOauthToken', result.access_token);
//         $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, fields: "id, first_name,email,location,picture", format: "json" }}).then(function(result2) {
//         $localstorage.set('user.name', result2.data.first_name);
//         $localstorage.set('user.id', result2.data.id);
//         $localstorage.set('user.email', result2.data.email);}, function(e){alert(e)});
//         //var picture = result.data.picture;
//         // $location.path("/tab/dash");
//     }, function(error) {
//         alert("There was a problem signing in!  See the console for logs");
//         console.log(error);
//     });
//     };
    
//     $scope.google = function () {
//         console.log("I've been clicked!");
//        $cordovaOauth.google("1090639021269-o87cav3hut98lnse9lbjiovk9krj3cae.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
//        console.log(JSON.stringify(result));
//        $localstorage.set('gOauthToken', result.access_token);
//                     $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token).then(function(result2) {
//         $localstorage.set('user.name', result2.data.given_name);
//         $localstorage.set('user.id', result2.data.id);
//         $localstorage.set('user.email', result2.data.email);
//         console.log(result2);
//                     }, function(e){alert(e)});
//         }, function(error) {
//             console.log(error);
//         });
//     };

// })


// .controller('SignUpCtrl', function($scope, $state) {
//   $scope.createUser = function () {
//     console.log("button clicked");
//     $state.go('auth.signin');
//   }
// })


.controller('TabsCtrl', function ($scope, $state){
    $scope.goTo= function(state){
        $state.go(state);
    }

})


.controller('EventsCtrl', function($state, $scope, $volunteer) {
    $volunteer.getEvents('92109','10').success(function(data, status, headers, config){
        $scope.events = data.items;
    });

    $scope.selection = function(choice) {
        $state.go('tab.events-detail', { myParam: { selection: choice } })
    };
})


.controller('EventsDetailCtrl', function($scope, $state, API, $localstorage, $stateParams) {
  $scope.selection = $stateParams.myParam.selection;

  $scope.saveToMyList = function (choice) {
    choice.userId = $localstorage.get('user.id');
    API.saveMyList(choice, $localstorage.get('user.id')).success(function(data, status, headers, config){
    });
    $state.go('tab.events');
  }
})


.controller('MyListCtrl', function($scope, $state, $localstorage, API) {
    API.getAllMyList($localstorage.get('user.id')).success(function(data, status, headers, config){
        $scope.events = data;
    });

    $scope.selection = function(choice) {
        $state.go('tab.mylist-detail', { myParam: { selection: choice } })
    };
})


.controller('MyListDetailCtrl', function($scope, $state, API, $stateParams) {
    $scope.selection = $stateParams.myParam.selection;

    $scope.deleteFromMyList = function (choice) {
        API.deleteMyList(choice).success(function(data, status, headers, config){
            $state.go('tab.mylist');
        });
    };
})


.controller('AccountCtrl', function($scope, $localstorage) {
  $scope.userZip; 
  $scope.userRadius; 
  $scope.userTimeFrame;

  $scope.activate = function() {
    $scope.userZip = $localstorage.getObject('userSettings').location;
    $scope.userRadius = $localstorage.getObject('userSettings').radius;
    $scope.userTimeFrame = $localstorage.getObject('userSettings').timeframe;
  };
  
  $scope.activate();
  
      
  $scope.reset = function () {
      $localstorage.setObject('userSettings', { 
          location: $localstorage.get('user.Zip'),
          radius: 10,
          timeframe: "this_week"
      });
      $scope.activate();
  };
  
  if($localstorage.getObject('userSettings') == null)
  {
      $scope.reset();
  }

  $scope.save = function () {
      console.log("I've been clicked!");
      $localstorage.setObject('userSettings', { 
          location: $scope.userZip,
          radius: $scope.userRadius,
          timeframe: $scope.userTimeFrame
      });
    };
});
