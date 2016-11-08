# Neighbourhood-Map-Project #

## How to Run ##

1. Clone or download the github repository onto your computer.
2. Open the folder containing the project
3. Open index.html in your preferred browser( firefox, chrome).

## How to Use ##

The webpage contains a map and a list showing the places marked in the map.
The various features associated with the webpage are:

1. The markers on the map can be clicked to view information about the map.
2. The names on the list can be clicked to activate the corresponding marker.
3. The search bar can be used to filter the list items and the markers on the map.
4. The reset button can be used to reset the map to its default position.
5. The hamburger icon can be used to show or hide the list navigation when requied.

## About the Webpage ##

This webpage is created using mainly two APIs.

1. Google Maps API
2. Wikipedia API.

The googlemaps API is used to load the google map and display markers on the screen.
The wiki API is used to display the corresponding wikipedia page of each of the places,
on its infowindow, when the place is selected.

The project is built using the MVVM framework making use of knockoutJS.
The DOM elements in this project are mainly changed using the knockout data binding method.

The jquery-3.1.1 is used so as to fetch the wikipedia details. The details are
fetched in a JSONP format
