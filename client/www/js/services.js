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
    getAll: function (email) {
      return $http.get(base+'/events', {
        method: 'GET',
        params: {
          token: email
        }
      });
    },
    getOne: function (id) {
      return $http.get(base+'/event/' + id, {
        method: 'GET',
        params: {
          // token: email
        }
      });
    },
    saveItem: function (form) {
      return $http.post(base+'/events', form, {
        method: 'POST',
        params: {
          // token: email
        }
      });
    },
    putItem: function (id) {
      return $http.put(base+'/event/' + id, {
        method: 'PUT',
        params: {
          // token: email
        }
      });
    },
    deleteItem: function (id) {
      return $http.delete(base+'/event/' + id, {
        method: 'DELETE',
        params: {
          // token: email
        }
      });
    }
  }
});
