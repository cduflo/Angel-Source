angular.module('starter.services', [])
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
    getAllEvents: function (email) {
      return $http.get(base+'/events', {
        method: 'GET',
        params: {
          token: email
        }
      });
    },
    getOneEvent: function (id) {
      return $http.get(base+'/event/' + id, {
        method: 'GET',
        params: {
          // token: email
        }
      });
    },
    saveEvents: function (form) {
      return $http.post(base+'/events', form, {
        method: 'POST',
        params: {
          // token: email
        }
      });
    },
    putEvent: function (id) {
      return $http.put(base+'/event/' + id, {
        method: 'PUT',
        params: {
          // token: email
        }
      });
    },
    deleteEvent: function (id) {
      return $http.delete(base+'/event/' + id, {
        method: 'DELETE',
        params: {
          // token: email
        }
      });
    },
    getAllMyList: function (email) {
      return $http.get(base+'/mylist', {
        method: 'GET',
        params: {
          token: email
        }
      });
    },
    getOneMyList: function (id) {
      return $http.get(base+'/mylist/' + id, {
        method: 'GET',
        params: {
          // token: email
        }
      });
    },
    saveMyList: function (form) {
      return $http.post(base+'/mylist', form, {
        method: 'POST',
        params: {
          // token: email
        }
      });
    },
    putMyList: function (id) {
      return $http.put(base+'/mylist/' + id, {
        method: 'PUT',
        params: {
          // token: email
        }
      });
    },
    deleteMyList: function (id) {
      return $http.delete(base+'/mylist/' + id, {
        method: 'DELETE',
        params: {
          // token: email
        }
      });
    }
  }
});
