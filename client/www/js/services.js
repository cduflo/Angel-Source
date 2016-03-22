angular.module('starter.services', [])
    .factory('$volunteer', function ($http) {
        return {
            getEvents: function (loc, dist, timeframe, counter) {
                return $http.get('http://api2.allforgood.org/api/volopps?key=OriginCode&vol_loc=' + loc + '&vol_dist=' + dist + '&timeperiod=' + timeframe + '&start=' + counter + '&output=json&num=20', {
                    method: 'GET'
                });
            }
        }
    })
    .factory('$Loc', function ($localstorage, $http, $cordovaGeolocation) {
        return {
            getIP: function () {
                var options = {
                    timeout: 10000,
                    enableHighAccuracy: true
                };
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    var latLng = '';
                    if (position.status == 'succ') {
                        latLng = position.Result;
                    } else {
                        latLng = "nope";
                    }
                    return latLng
                })
            }
        }
    })
    .factory('$network', function ($localstorage, $http, $cordovaGeolocation) {
        return {
            //fetches user current lat/lng, sets user.Zip and userLocation local variables
            getUserZip: function () {
                var options = {
                    timeout: 10000,
                    enableHighAccuracy: true
                };
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&result_type=street_address&key=AIzaSyBB5WwrBZdbLWp_LZoM0nvnWokSIzAobwc').
                    success(function (data, status, headers, config) {
                        console.log(data.results[0]);
                        for (var i = 0; i < data.results[0].address_components.length; i++) {
                            var component = data.results[0].address_components[i];
                            if (component.types[0] == "postal_code") {
                                console.log(component.long_name);
                                $localstorage.set('user.Zip', component.long_name);
                                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + component.long_name + '&key=AIzaSyC7BKnOpmeElH2WplryoQPYulmQ8qHDG7E').
                                success(function (data, status, headers, config) {
                                    console.log(data.results[0]);
                                    $localstorage.setObject('userLocation', {
                                        lat: data.results[0].geometry.location.lat,
                                        lng: data.results[0].geometry.location.lng
                                    });
                                }).
                                error(function (x, status, headers, config) {
                                    console.log("Error with Lat/Lng to Zip lookup");
                                });
                            }
                        }
                    }).
                    error(function (x, status, headers, config) {
                        console.log("Error with Lat/Lng to Zip lookup");
                    });
                });
            },
            //fetches lat/lng of requested Zip Code and applies it to userLocation local variable
            getLatLng: function (zip) {
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyC7BKnOpmeElH2WplryoQPYulmQ8qHDG7E').
                success(function (data, status, headers, config) {
                    console.log(data.results[0]);
                    $localstorage.setObject('userLocation', {
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng
                    });
                }).
                error(function (x, status, headers, config) {
                    console.log("Error with Lat/Lng to Zip lookup");
                });
            }
        }
    })
    //sets Accounts default settings and user current Zip Code in userSettings local variable, sets user.Zip local variable, 
    .factory('$settings', function ($localstorage, $http, $cordovaGeolocation) {
        return {
            setDefault: function () {
                var options = {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&result_type=street_address&key=AIzaSyC7BKnOpmeElH2WplryoQPYulmQ8qHDG7E').
                    success(function (data, status, headers, config) {
                        console.log(data.results[0]);
                        for (var i = 0; i < data.results[0].address_components.length; i++) {
                            var component = data.results[0].address_components[i];
                            if (component.types[0] == "postal_code") {
                                console.log(component.long_name);
                                $localstorage.set('user.Zip', component.long_name);
                                $localstorage.setObject('userSettings', {
                                    location: component.long_name,
                                    radius: "10",
                                    timeframe: "this_week"
                                });
                            }
                        }
                    }).
                    error(function (x, status, headers, config) {
                        console.log("Error with Lat/Lng to Zip lookup");
                    });
                });

            }

        }
    })

.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('API', function ($rootScope, $http, $ionicLoading, $window) {
    //   var base = "http://localhost:9804";
    var base = "https://angel-source.herokuapp.com";
    $rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };

    $rootScope.hide = function () {
        $ionicLoading.hide();
    };

    $rootScope.logout = function () {
        $rootScope.setToken("");
        $window.location.href = '#/auth/signin';
    };

    $rootScope.notify = function (text) {
        $rootScope.show(text);
        $window.setTimeout(function () {
            $rootScope.hide();
        }, 1999);
    };

    $rootScope.doRefresh = function (tab) {
        if (tab == 1)
            $rootScope.$broadcast('fetchAll');
        else
            $rootScope.$broadcast('fetchCompleted');

        $rootScope.$broadcast('scroll.refreshComplete');
    };

    $rootScope.setToken = function (token) {
        return $window.localStorage.token = token;
    }

    $rootScope.getToken = function () {
        return $window.localStorage.token;
    }

    $rootScope.isSessionActive = function () {
        return $window.localStorage.token ? true : false;
    }

    return {
        getAllMyList: function (userId) {
            return $http.get(base + '/mylist/' + userId, function (err, req, res, status) {
                if (err) {
                    console.log("An error ocurred >>>>>>");
                    console.log(err);
                } else {
                    console.log('Product deleted >>>>>>>');
                    console.log(status);
                }
            });
        },
        saveMyList: function (form, userId) {
            return $http.post(base + '/mylist/' + userId, form, {
                method: 'POST',
                params: {}
            });
        },
        deleteMyList: function (choice) {
            return $http.delete(base + '/mylist/' + choice._id, function (err, req, res, status) {
                if (err) {
                    console.log("An error ocurred >>>>>>");
                    console.log(err);
                } else {
                    console.log('Product deleted >>>>>>>');
                    console.log(status);
                }
            });
        }
    }
});