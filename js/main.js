var map;
//Observable array to store the model of the framework.
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

//Array to store the markers that have been created for each place in the map
var markers = [];

//Array to store the infowindows which have been created for each markers.
var infoWindows = [];

function initMap() {
  if(window.innerWidth >= 850) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 21.767, lng: 78.8718},
      zoom: 5,
      mapTypeControl: false,
      disableDefaultUI: true
    });
  }
  if(window.innerWidth <= 800 && window.innerWidth > 600){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 21.767, lng: 78.8718},
      zoom: 5,
      mapTypeControl: false,
      disableDefaultUI: true
    });
  }
  if(window.innerWidth <=500) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 21.767, lng: 78.8718},
      zoom: 4,
      mapTypeControl: false,
      disableDefaultUI: true
    });
  }


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
};

//Function to animate the marker once the marker is selected.
function animateMarker(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  //Set timeout for Animation
  setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}

//Function that takes care of the 3rd party api for the project. This function
//takes the name of the place as the input and gets the wikipedia page that is
//assosciated with the page.
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

//Function to generate the infowindow for each marker.
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

  //Function to use the searchText to filter out the markers displayed on the map.
  //This function returns an array which is used to control the names displayed on
  //the list.
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

  //Function to reset the map to its default position when button is clicked.
  this.mapReset = function () {
    map.setZoom(5);
    map.setCenter(new google.maps.LatLng(21.767, 78.8718));
    closeInfoWindows();
  };

  //Function to invoke the show/hideNav functions according to the value of
  //navBar variable.
  this.listOut = function() {
    if(navBar == true) {
      hideNav();
    }
    else if(navBar == false) {
      showNav();
    }
  };

  //Function to show the marker on clicking the list item corresponding to
  //that marker and in turn displaying infowindow of that corresponding place.
  this.showMarker = function(model_data) {
    var i = model_data.id - 1;
    google.maps.event.trigger(markers[i], "click");
  }

  localStorage.removeItem('alerted');
};

//Function to hide the list Nav
function hideNav() {
  $('#list-view').hide();
  navBar = false;
}

//Function to show the list Nav
function showNav() {
  $('#list-view').show();
  navBar = true;
}

//ko.applyBindings(new viewModel());

//Hide Nav when screen width is < 800
//Show Nav if screen width is >= 850 or height >= 595
//Function runs when window is resized
$(window).resize(function() {
    //To Hide Nav
    if (window.innerWidth < 800) {
        //call noNav function
        hideNav();
    }
    //To Show Nav
    if (window.innerWidth >= 850) {

        if (window.innerHeight > 595) {
            // call yesNav function
            showNav();
        }
    }
    if (window.innerWidth <= 550) {
      hideNav();
    }
});

ko.applyBindings(new viewModel());

//Function to display google maps error
function googleError(){
  console.log('hi');
  alert("Sorry, We are experiencing trouble loading the Google Maps");
};
