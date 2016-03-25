angular.module('starter.services', [])
    .factory('$facebook', function ($state, $localstorage, $cordovaOauth, $http) {
        return {
            login: function () {
                $cordovaOauth.facebook("1173863462625566", ["email", "public_profile"], {
                        redirect_uri: "http://localhost/callback"
                    })
                    .then(function (result) {
                        $localstorage.set('fbOauthToken', result.access_token);
                        $http.get("https://graph.facebook.com/v2.2/me", {
                            params: {
                                access_token: result.access_token,
                                fields: "id, first_name,email,location,picture",
                                format: "json"
                            }
                        }).then(function (result2) {
                            $localstorage.set('user.name', result2.data.first_name);
                            $localstorage.set('user.id', result2.data.id);
                            $localstorage.set('user.email', result2.data.email);
                        }, function (e) {
                            alert(e)
                        });
                        $state.go('tab.events');
                    }, function (error) {
                        alert("There was a problem signing in!  See the console for logs");
                        console.log(error);
                    });
            }
        }
    })
    .factory('$google', function ($state, $localstorage, $cordovaOauth, $http) {
        return {
            login: function () {
                $cordovaOauth.google("1090639021269-o87cav3hut98lnse9lbjiovk9krj3cae.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function (result) {
                    $localstorage.set('gOauthToken', result.access_token);
                    $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token).then(function (result2) {
                        $localstorage.set('user.name', result2.data.given_name);
                        $localstorage.set('user.id', result2.data.id);
                        $localstorage.set('user.email', result2.data.email);
                        $state.go('tab.events');
                    }, function (e) {
                        alert(e)
                    });
                }, function (error) {
                    console.log(error);
                });
            }
        }
    })

.factory('$volunteer', function ($http) {
        return {
            getEvents: function (loc, dist, timeframe, counter) {
                return $http.get('http://api2.allforgood.org/api/volopps?key=OriginCode&vol_loc=' + loc + '&vol_dist=' + dist + '&timeperiod=' + timeframe + '&start=' + counter + '&output=json&num=20', {
                    method: 'GET'
                });
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
    //   var base = "http://localhost:9804";   -- used for local testing. Discontinued because serve is now on Heroku
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

    $rootScope.notify = function (text) {
        $rootScope.show(text);
        $window.setTimeout(function () {
            $rootScope.hide();
        }, 1999);
    };

    return {
        getAllMyList: function (userId) {
            return $http.get(base + '/mylist/' + userId, function (err, req, res, status) {
                if (err) {
                    console.log("Error fetching MyList >>>>>>");
                    console.log(err);
                } else {
                    console.log('Status >>>>>>>');
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
                    console.log("Error deleting from MyList >>>>>>");
                    console.log(err);
                } else {
                    console.log('Product deleted >>>>>>>');
                    console.log(status);
                }
            });
        }
    }
});