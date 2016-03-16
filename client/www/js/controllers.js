angular.module('starter.controllers', ['ionic', 'ngCordovaOauth'])

.controller('LandingCtrl', function($state, $scope, $network, $localstorage, $cordovaOauth, $http) {
    $network.getIP();
//RE-ENABLE after TESTING. This bypasses login if the user is authenticated
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
         $state.go('tab.events');
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


.controller('EventsCtrl', function($state, $scope, $localstorage, $volunteer) {
    $scope.eventCounter = 21;
    $scope.fetch = function () {
    $volunteer.getEvents(
        $localstorage.getObject('userSettings').location,
        $localstorage.getObject('userSettings').radius,
        $localstorage.getObject('userSettings').timeframe, 
        $scope.eventCounter
    ).success(function(data, status, headers, config){
        if ($scope.eventCounter == 21) {
            $scope.events = data.items;
        } else {
            $scope.events = $scope.events.concat(data.items);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
    };
    $scope.fetch();
    
    $scope.loadMore = function () {
        $scope.eventCounter += 20;
        $scope.fetch();
    }

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

$scope.user = {};

$scope.sync = function() {
    angular.copy($scope.master, $scope.user);
}

$scope.activate = function () {
    $scope.master = {
    Zip: $localstorage.getObject('userSettings').location,
    Radius: $localstorage.getObject('userSettings').radius,
    TimeFrame: $localstorage.getObject('userSettings').timeframe
    };

    $scope.sync();
};

$scope.activate();

$scope.reset = function () {
    $localstorage.setObject('userSettings', { 
        location: $localstorage.get('user.Zip'),
        radius: "10",
        timeframe: "this_week"
        });
    $scope.activate();
};
  
$scope.save = function () {
    $localstorage.setObject('userSettings', { 
        location: $scope.user.Zip,
        radius: angular.copy($scope.user.Radius),
        timeframe: $scope.user.TimeFrame
        });

        $scope.activate();
};

});
