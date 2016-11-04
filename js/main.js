var map;
var model_data = ko.observableArray([
  {
    name: "Jim Corbett National Park",
    lat: 29.3255,
    lng: 78.567,
    location: "Nainital, Uttarakhand, India"
  },
  {
    name: "Port Blair",
    lat: 11.4006,
    lng: 92.4416,
    location: "South Andaman, Andaman and Nicobar Islands, India"
  },
  {
    name: "Kodaikanal",
    lat: 10.28,
    lng: 77.48,
    location: "Dindigul, TamilNadu, India"
  },
  {
    name: "Darjeeling",
    lat: 27.080,
    lng: 88.26,
    location: "Darjeeling, West Bengal, India"
  },
  {
    name: "Gangtok",
    lat: 27.33,
    lng: 88.62,
    location: "East Sikkim, Sikkim, India"
  },
  {
    name: "Agatti",
    lat: 10.50,
    lng: 73,
    location: "Lakshadweep, India"
  },
  {
    name: "Goa",
    lat: 15.498605,
    lng: 73.829262,
    location: "Goa, India"
  },
  {
    name: "Manali, Himachal Pradesh",
    lat:32.27,
    lng: 77.17,
    location: "Kullu, Himachal Pradesh, India"
  },
  {
    name: "Hampi",
    lat: 15.335,
    lng: 76.462,
    location: "Bellary, Karnataka, India"
  },
  {
    name: "Coorg",
    lat: 12.4208,
    lng: 75.7397,
    location: "Kodagu, Karnataka, India"
  }
]);

var markers = [];
var marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 21.767, lng: 78.8718},
    zoom: 5
  });

  var l_infowindow = new google.maps.InfoWindow();

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

    markers.push(marker);

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
    //Set timeout for 8 sec for wiki resources to load.
    alert("Failed to get Wikipedia resources");
  }, 8000);

  var x = $.ajax({
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
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker(null);
    });
}

var viewModel = function() {
  this.mapReset = function () {
    map.setZoom(5);
    map.setCenter(new google.maps.LatLng(21.767, 78.8718));
  };
};

ko.applyBindings(new viewModel());
