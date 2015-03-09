angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('MapCtrl', function($scope, $http, $ionicLoading, $compile, $interval) {
  var count = 0;
  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(15.516334,-88.030454);
    
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":"4"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"on"},{"saturation":"-100"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":20},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"80"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#797979"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfdfdf"},{"lightness":21},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fed41c"},{"visibility":"on"},{"weight":"3.00"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#fed41c"},{"gamma":"0.6"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#fed41c"},{"weight":"4.00"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"weight":"1"},{"gamma":"0.6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#b8b8b8"},{"lightness":18},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#b6b6b6"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"},{"color":"#656565"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#cdcdcd"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#b6b6b6"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#c5c5c5"},{"lightness":19},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c0d8e3"},{"lightness":17},{"visibility":"on"}]}];

    map.setOptions({styles: style});

    stop = $interval($scope.update, 3000);

    $scope.map = map;

  }

  $scope.update = function(){
    $http.get('http://178.62.173.38:1567/rutas').then(function(resp) {
      console.log('Entra');
      var markers = [];

      $scope.alertas = resp.data.ruta;

      for(var i = 0; i < resp.data.ruta.length - 1; i++){
        var myLatLng = new google.maps.LatLng(resp.data.ruta[i].col_lat, resp.data.ruta[i].col_long);
        var myLatLng2 = new google.maps.LatLng(resp.data.ruta[i + 1].col_lat, resp.data.ruta[i + 1].col_long);

        if(resp.data.ruta[i].col_velocidad > 45){
          if(resp.data.ruta[i].col_tipo == 109){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Freno',
                icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            });
          }
          else if(resp.data.ruta[i].col_tipo == 110){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Aceleron',
                icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            });
          }
          else if(resp.data.ruta[i].col_tipo == 111){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Giro',
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });
          }
          else{
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Alta Velocidad'
            });
          }
          var PathStyle = new google.maps.Polyline({
            path: [myLatLng, myLatLng2],
            strokeColor: '#4E7629',
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: map
          });
        }
        else{
          var PathStyle = new google.maps.Polyline({
            path: [myLatLng, myLatLng2],
            strokeColor: '#70a83b',
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: map
          });

          if(resp.data.ruta[i].col_tipo == 109){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Freno',
                icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            });
          }
          else if(resp.data.ruta[i].col_tipo == 110){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Aceleron',
                icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            });
          }
          else if(resp.data.ruta[i].col_tipo == 111){
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Giro',
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });
          }
        }
      }
      var myLatLng = new google.maps.LatLng(resp.data.ruta[0].col_lat, resp.data.ruta[0].col_long);
      var myLatInicio = resp.data.ruta[0].col_lat;
      var myLngInicio = resp.data.ruta[0].col_long;
      
      /*var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Trayectoria',
          icon: "http://expoconstruye.com/urbus/buses/bus3gris.png"
      });*/

      var myLatFinal;
      var myLngFinal;
      navigator.geolocation.getCurrentPosition(function(pos) {
        var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myLatFinal = pos.coords.latitude;
        myLngFinal = pos.coords.longitude;
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Mi Ubicación',
            icon: "http://www.credomobile.com/_img/support/nexus-5/bluedot.gif"
        });

        if(count == 0){
          map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        count = 1;

        //Calcula el tiempo
        $http.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + myLatInicio + ',' + myLngInicio + '&destination=' + myLatFinal + ',' + myLngFinal + '&sensor=false').then(function(resp) {
          $scope.Velocidad = resp.data.routes[0].legs[0].duration.text;
        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        });

      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
      }, 
      function(error) {
        alert('Unable to get location: ' + error.message);
      });

      //map.panTo(new google.maps.LatLng(resp.data.ruta[resp.data.ruta.length -1].col_lat, resp.data.ruta[resp.data.ruta.length -1].col_long));

      //Paradas de Buses
      for(var i = 0; i < resp.data.paradas.length; i++){
        var myLatLng = new google.maps.LatLng(resp.data.paradas[i].col_lat, resp.data.paradas[i].col_lng);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Parada',
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });

        var context = resp.data.paradas[i].code_parada;
        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker,'click', (function(marker,context,infowindow){ 
            return function() {
                infowindow.setContent(context);
                infowindow.open(map,marker);
            };
        })(marker,context,infowindow)); 

      }
  }
  google.maps.event.addDomListener(window, 'load', $scope.initialize());
  
})

.filter('TipoBus', function() {
  return function(tipo) {
    if(tipo == 109){
      var url_img = "http://expoconstruye.com/urbus/buses/bus1color.png";
    }
    else if(tipo == 110){
      var url_img = "http://expoconstruye.com/urbus/buses/bus3color.png";
    }
    else{
      var url_img = "http://expoconstruye.com/urbus/buses/bus2color.png";
    }
    return String(url_img);
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
