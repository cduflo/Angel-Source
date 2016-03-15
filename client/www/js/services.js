angular.module('starter.services', [])
.factory('$volunteer', function($http) {
    return {
    getEvents: function (loc, dist) {
      return $http.get('http://api2.allforgood.org/api/volopps?key=OriginCode&vol_loc='+loc+'&vol_dist='+dist+'&output=json', {
        method: 'GET'
      });
    }
//   return {
//     getEvents: function(loc, dist) {
//       $http.get('http://api2.allforgood.org/api/volopps?key=OriginCode&vol_loc='+loc+'&vol_dist='+dist+'&output=json').
//       success(function(data, status, headers, config) {
//            console.log(data.items);
//       return(data.items);

//       }).
//       error(function(data, status, headers, config) {
//       console.log("Error with fetching volunteer activities");
//       });
//     }
//   }
}})
.factory('$network', ['$window', '$http', function($window, $http) {
  return {
    getIP: function() {
      $http.get('http://ipv4.myexternalip.com/json').
      success(function(data, status, headers, config) {
      $window.localStorage['user.ip'] = data.ip;
          $http.get('http://freegeoip.net/json/'+ data.ip).
          success(function(loc,status,headers,config) {
            $window.localStorage['user.Zip'] = loc.zip_code;
            // loc.latitude, loc.longitude available if Maps integration
          }).
          error(function(x, status, headers, config){
            console.log("Error with IP to Zip lookup");
          });
      }).
      error(function(data, status, headers, config) {
      console.log("Error with fetching IP");
      });
    }
  }
}])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])
.factory('API', function ($rootScope, $http, $ionicLoading, $window) {
  var base = "http://localhost:9804";
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

  $rootScope.notify = function(text) {
    $rootScope.show(text);
    $window.setTimeout(function () {
      $rootScope.hide();
    }, 1999);
  };

  $rootScope.doRefresh = function (tab) {
    if(tab ==1)
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
    // signin: function (form) {
    //   return $http.post(base+'/api/v1/angelsource/auth/login', form);
    // },
    // signup: function (form) {
    //   return $http.post(base+'/api/v1/angelsource/auth/register', form);
    // },
    // getAllEvents: function (email) {
    //   return $http.get(base+'/events', {
    //     method: 'GET',
    //     params: {
    //       token: email
    //     }
    //   });
    // },
    // getOneEvent: function (id) {
    //   return $http.get(base+'/event/' + id, {
    //     method: 'GET',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    // saveEvents: function (form) {
    //   return $http.post(base+'/events', form, {
    //     method: 'POST',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    // putEvent: function (id) {
    //   return $http.put(base+'/event/' + id, {
    //     method: 'PUT',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    // deleteEvent: function (id) {
    //   return $http.delete(base+'/event/' + id, {
    //     method: 'DELETE',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    getAllMyList: function (userId) {
              return $http.get(base+'/mylist/' + userId
      , function (err, req, res, status) {
        if (err) {
            console.log("An error ocurred >>>>>>");
            console.log(err);
        } else {
            console.log('Product deleted >>>>>>>');
            console.log(status);
        }
      });
    //   return $http.get(base+'/mylist/' + userId, {
    //     method: 'GET'
    //     // ,
    //     // params: {
    //     //   userId: userId
    //     // }
    //   });
    },
    // getOneMyList: function (id) {
    //   return $http.get(base+'/mylist/' + id, {
    //     method: 'GET',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    saveMyList: function (form, userId) {
      return $http.post(base+'/mylist/' + userId, form, {
        method: 'POST',
        params: {
          // token: email
        }
      });
    },
    // putMyList: function (id) {
    //   return $http.put(base+'/mylist/' + id, {
    //     method: 'PUT',
    //     params: {
    //       // token: email
    //     }
    //   });
    // },
    deleteMyList: function (choice) {
      return $http.delete(base+'/mylist/' + choice._id
      , function (err, req, res, status) {
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
