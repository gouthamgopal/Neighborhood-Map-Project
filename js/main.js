var map;
var model_data = ko.observableArray([
  {
    name: "Jim Corbett National Park",
    lat: 29.3255,
    lng: 78.567,
    location: "Nainital, Uttarakhand, India",
    id: 1,
  },
  {
    name: "Port Blair",
    lat: 11.4006,
    lng: 92.4416,
    location: "South Andaman, Andaman and Nicobar Islands, India",
    id: 2,
  },
  {
    name: "Kodaikanal",
    lat: 10.28,
    lng: 77.48,
    location: "Dindigul, TamilNadu, India",
    id: 3,
  },
  {
    name: "Darjeeling",
    lat: 27.080,
    lng: 88.26,
    location: "Darjeeling, West Bengal, India",
    id: 4,
  },
  {
    name: "Gangtok",
    lat: 27.33,
    lng: 88.62,
    location: "East Sikkim, Sikkim, India",
    id: 5,
  },
  {
    name: "Agatti",
    lat: 10.50,
    lng: 73,
    location: "Lakshadweep, India",
    id: 6,
  },
  {
    name: "Goa",
    lat: 15.498605,
    lng: 73.829262,
    location: "Goa, India",
    id: 7,
  },
  {
    name: "Manali, Himachal Pradesh",
    lat:32.27,
    lng: 77.17,
    location: "Kullu, Himachal Pradesh, India",
    id: 8,
  },
  {
    name: "Hampi",
    lat: 15.335,
    lng: 76.462,
    location: "Bellary, Karnataka, India",
    id: 9,
  },
  {
    name: "Coorg",
    lat: 12.4208,
    lng: 75.7397,
    location: "Kodagu, Karnataka, India",
    id: 10,
  }
]);

var marker;
var markers = [];
var infoWindows = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 21.767, lng: 78.8718},
    zoom: 5,
    mapTypeControl: false,
    disableDefaultUI: true
  });


  for(var i = 0; i < model_data().length; i++) {

      marker = new google.maps.Marker({
      position: new google.maps.LatLng(model_data()[i].lat, model_data()[i].lng),
      map: map,
      title: model_data()[i].name,
      animation: google.maps.Animation.DROP,
      id: i,
      location: model_data()[i].location,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    model_data()[i].markerObject = marker;

    var l_infowindow = new google.maps.InfoWindow();
    markers.push(marker);
    infoWindows.push(l_infowindow);

    markers.forEach(function(marker) {
      getWiki(marker);
    });

    marker.addListener('mouseover', function() {
      this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    });

    marker.addListener('mouseout', function() {
      this.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    });

    marker.addListener('click', function() {
      animateMarker(this);
      generateInfoWindow(this, l_infowindow);
    });
  }
}

function animateMarker(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  //Set timeout for Animation
  setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}

function getWiki(marker) {
  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";

  var wikiRequestTimeout = setTimeout(function() {
    var alerted = localStorage.getItem('alerted') || '';
    if (alerted != 'no') {
      //Set timeout for 8 sec for wiki resources to load.
      alert("Failed to get Wikipedia resources");
      localStorage.setItem('alerted','no');
      }
  }, 4000);

  $.ajax({
    url: wikiURL,
    dataType: "jsonp",
    success: function(response) {
      var wikiURL = response[3][0];
      var Description = response[2][0];
      marker.url = wikiURL;
      marker.Description = Description;
      clearTimeout(wikiRequestTimeout);
    }
  });
}

function generateInfoWindow(marker, infowindow) {
    infowindow.marker = marker;
    var content = '<div><h1>' + marker.title + '</h1><hr>' +
                  '<br><p>' + marker.location + '</p></div>' +
                  '<a href="' + marker.url + '">' + marker.url +
                  '</a><p>' + marker.Description + '</p>';
    infowindow.setContent(content);
    infowindow.open(map,marker);
    map.setZoom(7);
    map.setCenter(marker.position);
}

//close info windows
closeInfoWindows = function() {

    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
}

var navBar = true;

var viewModel = function() {

  this.searchText = ko.observable("");

  this.setMarker = ko.computed(function(){
    var string = this.searchText().toLowerCase();
    return ko.utils.arrayFilter(model_data(), function(places)  {
    if(places.name.toLowerCase().indexOf(string) == 0) {
      if(places.markerObject) {
        places.markerObject.setVisible(true);
      }
      return true;
      }
      else {
        places.markerObject.setVisible(false);
      }
    });
  }, this);

  this.mapReset = function () {
    map.setZoom(5);
    map.setCenter(new google.maps.LatLng(21.767, 78.8718));
    closeInfoWindows();
  };

  this.listOut = function() {
    if(navBar == true) {
      hideNav();
    }
    else if(navBar == false) {
      showNav();
    }
  };

  this.showMarker = function(model_data) {
    var i = model_data.id - 1;
    google.maps.event.trigger(markers[i], "click");
  }

  localStorage.removeItem('alerted');
};

function hideNav() {
  $('#list-view').hide();
  navBar = false;
}

function showNav() {
  $('#list-view').show();
  navBar = true;
}

ko.applyBindings(new viewModel());
