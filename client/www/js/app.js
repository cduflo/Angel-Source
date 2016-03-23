//Angel-Source App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngCordovaOauth', 'ngMap'])

.run(function ($ionicPlatform, $network, $settings, $cordovaSplashscreen) {
    $ionicPlatform.ready(function () {

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

        //Hide splash screen after 2 seconds, gives the application time to fetch user location and set default settings
        setTimeout(function () {
            $cordovaSplashscreen.hide()
        }, 2000);

        //Fetches user's current location and sets User defaults to local storage and Settings tab
        $settings.setDefault();
        $network.getUserZip();
    });
})


.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing')

    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: "templates/landing.html",
            controller: 'LandingCtrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'TabsCtrl'
        })
        .state('tab.events', {
            cache: false,
            params: {
                myParam: null
            },
            url: '/events',
            views: {
                'tab-events': {
                    templateUrl: 'templates/tab-events.html',
                    controller: 'EventsCtrl'
                }
            }
        })
        .state('tab.events-detail', {
            params: {
                myParam: null
            },
            url: '/events/placeholder', //EventsId
            views: {
                'tab-events': {
                    templateUrl: 'templates/events-detail.html',
                    controller: 'EventsDetailCtrl'
                }
            }
        })
        .state('tab.events-map', {
            cache: false,
            params: {
                myParam: null
            },
            url: '/events/map', //EventsId
            views: {
                'tab-events': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapCtrl'
                }
            }
        })
        .state('tab.mylist', {
            cache: false,
            params: {
                myParam: null
            },
            url: '/mylist',
            views: {
                'tab-mylist': {
                    templateUrl: 'templates/tab-mylist.html',
                    controller: 'MyListCtrl'
                }
            }
        })
        .state('tab.mylist-detail', {
            params: {
                myParam: null
            },
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