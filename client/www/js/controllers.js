angular.module('starter.controllers', ['ionic', 'ngCordovaOauth', 'ngCordova', 'ngMap'])

.controller('LandingCtrl', function ($state, $scope, $localstorage, $facebook, $google) {
    if (typeof $localstorage.get('user.id') != "undefined") {
       $state.go('tab.events');
   }
    $scope.facebook = function () {
        $facebook.login();
    };

    $scope.google = function () {
        $google.login();
    };

})

.controller('TabsCtrl', function ($scope, $state) {
    $scope.goTo = function (state) {
        $state.go(state);
    }
})

.controller('EventsCtrl', function ($state, $scope, $localstorage, $volunteer, API, $ionicListDelegate, $ionicLoading, $ionicPopup, $cordovaSocialSharing) {
    $scope.eventCounter = 21;
    $scope.fetch = function () {
        $volunteer.getEvents(
            $localstorage.getObject('userSettings').location,
            $localstorage.getObject('userSettings').radius,
            $localstorage.getObject('userSettings').timeframe,
            $scope.eventCounter
        ).success(function (data, status, headers, config) {
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

    $scope.selection = function (choice) {
        $state.go('tab.events-detail', {
            myParam: {
                selection: choice,
                origin: "list"
            }
        })
    };

    $scope.saveToMyList = function (choice) {
        choice.userId = $localstorage.get('user.id');
        API.saveMyList(choice, $localstorage.get('user.id')).success(function (data, status, headers, config) {});
        var alertPopup = $ionicPopup.alert({
            title: "Great news!",
            template: choice.title + " was added your to My List"
        });

        alertPopup.then(function (res) {});

        $ionicListDelegate.closeOptionButtons();
    };

    $scope.share = function (event) {
        $cordovaSocialSharing.share(event.description, "Hey! Check out this volunteer opportunity!", null, event.base_url);
    };

})


.controller('EventsDetailCtrl', function ($scope, $state, API, $localstorage, $stateParams, $cordovaInAppBrowser) {
    $scope.selection = $stateParams.myParam.selection;

    $scope.saveToMyList = function (choice) {
        choice.userId = $localstorage.get('user.id');
        API.saveMyList(choice, $localstorage.get('user.id')).success(function (data, status, headers, config) {});
        if ($stateParams.myParam.origin == "list") {
            $state.go('tab.events');
        } else {
            $state.go('tab.events-map');
        }
    };

    $scope.launchExtMap = function () {
        var address = $scope.selection.location_name;
        var url = '';
        //        url = "http://maps.apple.com/maps?q=" + encodeURIComponent(address);
        url = "http://maps.google.com?q=" + encodeURIComponent(address);
        window.open(url, "_system", 'location=no');
    }
})

.controller('MapCtrl', function ($rootScope, $scope, $state, $localstorage, $volunteer, $network, $compile) {
    $localstorage.set('counter', 1);
    $scope.records = [];
    var infowindow;
    var currentRecord;

    $scope.goToEventDetail = function () {
        infowindow.close();
        $state.go('tab.events-detail', {
            myParam: {
                selection: currentRecord
            }
        })
    };

    $scope.fetch = function () {
        $volunteer.getEvents(
            $localstorage.getObject('userSettings').location,
            $localstorage.getObject('userSettings').radius,
            $localstorage.getObject('userSettings').timeframe,
            $localstorage.get('counter')
        ).then(function (markers) {
            if ($localstorage.get('lastLoc') == $localstorage.getObject('userSettings').location) {
                $localstorage.set('counter', parseInt($localstorage.get('counter')) + 20);
            } else {
                $localstorage.set('lastLoc', $localstorage.getObject('userSettings').location);
                $localstorage.set('counter', 1);
            }
            markers.data.items.forEach(function (item) {
                $scope.records.push(item)
            });
            console.log($scope.records);
        })
    }

    $scope.$on('mapInitialized', function (event, map) {
        google.maps.event.trigger(map, 'resize');
        $scope.objMapa = map;
        $scope.records = [];
        $scope.lat = $localstorage.getObject("userLocation").lat;
        $scope.lng = $localstorage.getObject("userLocation").lng;
        $scope.fetch();
    });

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (infowindow) {
                infowindow.close();
            }
        })

    $scope.showInfoWindow = function (event, record) {
        if (infowindow) {
            infowindow.setContent();
            infowindow.close();
        }
        currentRecord = record;
        infowindow = new google.maps.InfoWindow();
        var latlong = record.latlong.split(",");
        record.lat = latlong[0];
        record.lng = latlong[1];
        var center = new google.maps.LatLng(record.lat, record.lng);
        //        var infoWindowContent = "<h4>" + record.title + "</h4><p>" + record.description + '</p><a onClick="window.open(\'' + record.detailUrl + '\',\'_system\',\'location=yes\');return false;">More Details & Sign-Up</a><button class="button button-block button-positive" ng-click="$parent.saveToMyList()">Save to <strong>My List</strong> </button>';
        var infoWindowContent = '<button class="button button-block button-positive" ng-click="goToEventDetail()">' + record.title + '</button>';
        compiled = $compile(infoWindowContent)($scope);
        infowindow.setContent(compiled[0]);

        infowindow.setPosition(center);
        infowindow.open($scope.objMapa);
    }

})


.controller('MyListCtrl', function ($scope, $state, $localstorage, API, $ionicLoading, $cordovaSocialSharing) {
    if ($localstorage.get('MyList') == "not accessed") {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }

    API.getAllMyList($localstorage.get('user.id')).success(function (data, status, headers, config) {
        $scope.events = data;
        $localstorage.set('MyList', "accessed");
        $ionicLoading.hide();
    });

    $scope.selection = function (choice) {
        $state.go('tab.mylist-detail', {
            myParam: {
                selection: choice
            }
        })
    };

    $scope.deleteFromMyList = function (choice) {
        API.deleteMyList(choice).success(function (data, status, headers, config) {
            $scope.events.splice($scope.events.indexOf(choice), 1);
        });
    };

    $scope.share = function (event) {
        $cordovaSocialSharing.share(event.description, "Hey! Check out this volunteer opportunity!", null, event.base_url);
    };
})


.controller('MyListDetailCtrl', function ($scope, $state, API, $stateParams) {
    $scope.selection = $stateParams.myParam.selection;

    $scope.deleteFromMyList = function (choice) {
        API.deleteMyList(choice).success(function (data, status, headers, config) {
            $state.go('tab.mylist');
        });
    };

    $scope.launchExtMap = function () {
        var address = $scope.selection.location_name;
        var url = '';
        url = "http://maps.google.com?q=" + encodeURIComponent(address);
        window.open(url, "_system", 'location=no');
    }
})


.controller('AccountCtrl', function ($scope, $state, $localstorage, $network) {
    $scope.user = {};

    $scope.sync = function () {
        angular.copy($scope.master, $scope.user);
    }

    $scope.activate = function () {
        $scope.master = {
            Zip: $localstorage.getObject('userSettings').location,
            Radius: $localstorage.getObject('userSettings').radius,
            TimeFrame: $localstorage.getObject('userSettings').timeframe
        };

        $scope.sync();
        $network.getLatLng($localstorage.getObject('userSettings').location);
    };

    $scope.reset = function () {
        $localstorage.setObject('userSettings', {
            location: $localstorage.get('user.Zip'),
            radius: "10",
            timeframe: "this_week"
        });
        $scope.activate();
    };

    if ($scope.user.Zip == undefined || $scope.user.Radius == undefined || $scope.user.TimeFrame == undefined) {
        $scope.reset();
    }

    $scope.save = function () {
        $localstorage.setObject('userSettings', {
            location: $scope.user.Zip,
            radius: angular.copy($scope.user.Radius),
            timeframe: $scope.user.TimeFrame
        });

        $scope.activate();
    };

    $scope.logout = function () {
        $localstorage.destroy("user.id");
        $state.go('landing');
    }

});