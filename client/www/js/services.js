angular.module('starter.services', [])
.factory('$volunteer', function($http) {
    return {
    getEvents: function (loc, dist, timeframe, counter) {
      return $http.get('http://api2.allforgood.org/api/volopps?key=OriginCode&vol_loc='+loc+'&vol_dist='+dist+'&timeperiod='+timeframe+'&start='+counter+'&output=json&num=20', {
        method: 'GET'
      });
    }
}})
.factory('$network', function($localstorage, $http, $cordovaGeolocation) {
      return {
    getIP: function() {
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log(position);
              $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&result_type=street_address&key=AIzaSyBB5WwrBZdbLWp_LZoM0nvnWokSIzAobwc').
              success(function(data,status,headers,config) {
                  console.log(data.results[0]);
              for(var i=0; i < data.results[0].address_components.length; i++)
                {
                    var component = data.results[0].address_components[i];
                    if(component.types[0] == "postal_code")
                    {
                        console.log(component.long_name);
                        $localstorage.set('user.Zip', component.long_name);
                    }
                }
          }).
          error(function(x, status, headers, config){
            console.log("Error with Lat/Lng to Zip lookup");
          });
    });
    }
  }
})
.factory('GoogleMaps', function($cordovaGeolocation, $volunteer, API, $localstorage){
  
  $localstorage.set('lastLoc', "null");
  $localstorage.set('counter', 1);
  
  var apiKey = false;
  var map = null;
 
  function initMap(){
 
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log(position);
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
 
        //Load the markers
        loadMarkers();
 
      });
 
    }, function(error){
      console.log("Could not get location");
 
        //Load the markers
        loadMarkers();
    });
 
  }

  function loadMarkers(){
      //Get all of the markers from our Markers factory
      $volunteer.getEvents(
        $localstorage.getObject('userSettings').location,
        $localstorage.getObject('userSettings').radius,
        $localstorage.getObject('userSettings').timeframe, 
        $localstorage.get('counter')
        ).then(function(markers){
            if ($localstorage.get('lastLoc') == $localstorage.getObject('userSettings').location){
                $localstorage.set('counter', parseInt($localstorage.get('counter')) + 20);
            } else {
                $localstorage.set('lastLoc', $localstorage.getObject('userSettings').location);
                $localstorage.set('counter', 1);
            }
        
        console.log("Markers: ", markers);
 
        var records = markers.data.items;
 
        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   
          var latlong = record.latlong.split(",");
          var lat = latlong[0];
          var long = latlong[1];
          var markerPos = new google.maps.LatLng(lat, long);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });
          

 
          var infoWindowContent = "<h4>" + record.title + "</h4>"+ "<a href="+record.detailUrl+">More Details & Sign-Up</a>";
        //   "<h4>" + record.title + "</h4>"+ "<a href="+record.detailUrl+">More Details & Sign-Up</a>"+  '<button class="button button-block button-positive" ng-click="saveToMyList()">Save to <strong>My List</strong> </button>  ';
        //   var infoWindowContent = $compile(preInfoWindowContent)($scope);       
        // console.log(infoWindowContent[0]);    
          addInfoWindow(marker, infoWindowContent, record);
 
        }
 
 /////REFACTOR       /////
        var image = './img/male-2.png';
        
         var options = {timeout: 10000, enableHighAccuracy: true};
 
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log(position);
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
        var userLoc = new google.maps.Marker({
              map: map,
              icon: image,
              position: latLng
          });
      })
 //REFACTOR   //////
      }); 
 
  }
  
  var prev_infowindow =false; 
 
  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {
      if( prev_infowindow ) {
           prev_infowindow.close();
        }

        prev_infowindow = infoWindow;
        infoWindow.open(map, marker);
    });
 
  }
 
  return {
    init: function(){
      initMap();
    },
    loadMore: function(){
      loadMarkers();
    }
  }
 
})

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
