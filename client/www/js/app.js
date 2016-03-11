// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/landing')
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('landing', {
    url: '/landing',
    templateUrl: "templates/landing.html",
    controller: 'LandingCtrl'
  })
  .state('auth', {
    url: "/auth",
    abstract: true,
    templateUrl: "templates/auth.html"
  })
  .state('auth.signin', {
    url: '/signin',
    views: {
      'auth-signin': {
        templateUrl: 'templates/auth-signin.html',
        controller: 'SignInCtrl'
      }
    }
  })
  .state('auth.signup', {
    url: '/signup',
    views: {
      'auth-signup': {
        templateUrl: 'templates/auth-signup.html',
        controller: 'SignUpCtrl'
      }
    }
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:

      .state('tab.events', {
        cache:false,
        params: {myParam: null},
        url: '/events',
        views: {
          'tab-events': {
            templateUrl: 'templates/tab-events.html',
            controller: 'EventsCtrl'
          }
        }
      })
  .state('tab.events-detail', {
    params: {myParam: null},
    url: '/events/placeholder', //EventsId
    views: {
      'tab-events': {
        templateUrl: 'templates/events-detail.html',
        controller: 'EventsDetailCtrl'
      }
    }
  })

  .state('tab.mylist', {
      cache:false,
      params: {myParam: null},
      url: '/mylist',
      views: {
        'tab-mylist': {
          templateUrl: 'templates/tab-mylist.html',
          controller: 'MyListCtrl'
        }
      }
    })
    .state('tab.mylist-detail', {
      params: {myParam: null},
      url: '/mylist/placeholder', //EventId
      views: {
        'tab-mylist': {
          templateUrl: 'templates/mylist-detail.html',
          controller: 'MyListDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

})
