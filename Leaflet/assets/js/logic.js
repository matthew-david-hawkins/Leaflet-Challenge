// Store our API endpoint inside queryUrl
var endTime = "2019-11-22";
var startTime = "2019-10-22";
var minLon = -180; // [-360,360]
var maxLon = -60; // [-360,360]
var minLat = 0; // [-90,90]
var maxLat = 90; // [-90,90]
var limit = 500; // [1,20000]
var orderBy = "time"
var mapCenter = [(minLat+maxLat)/2, (minLon+maxLon)/2]

// Documentation at: https://earthquake.usgs.gov/fdsnws/event/1/

//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// var queryUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=` +
//   `${endTime}&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337`;

var queryUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=` +
  `${endTime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}&limit=${limit}` +
  `&orderby=${orderBy}`;

console.log(queryUrl)

// Determine the color for markers and legend based on earthquake magnitude
function getColor(d) {
  console.log("doin a color")
  return d > 5  ? '#BD0026' :
          d > 4  ? '#E31A1C' :
         d > 3  ? '#FC4E2A' :
         d > 2  ? '#FD8D3C' :
         d > 1  ? '#FEB24C' :
                   '#FFEDA0';
}

// function for creating markers and bound pop-ups
function createFeatures(earthquakeData, tectonicData) {

  // Define a function we want to run once for each feature in the features array
  function onEachFeature(feature, layer) {
    // If there is no"felt x miles away" record, don't include it in the popup
    if (feature.properties.felt === null || feature.properties.felt === undefined){
      //show popup with magnitude and time of the earthquake
      htmlStr = "<h3>Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
    }
    else{
      //show popup with magnitude, felt x miles away, and time of the earthquake
      htmlStr = "<h3>Magnitude: " + feature.properties.mag + `, Felt ${feature.properties.felt} Miles Away` +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
    }
    layer.bindPopup(htmlStr);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, latlng) {

      //define the marker colors as markers with color and size dependent on magnitude
      var geojsonMarkerOptions = {
        radius: feature.properties.mag * 1.5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      // Put a circular maker on each feature
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  var myStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.65
  };

  // Create a GeoJson layer containing the tectonic plates features array 
  var plates = L.geoJSON(tectonicData, {
    style: myStyle
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, plates);
}

// function for creating base map, legend, and control
function createMap(earthquakes, plates) {

  // Define streetmap and darkmap layers
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Outdoors Map": outdoorsmap,
    "Satellite": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plates: plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: mapCenter,
    zoom: 3,
    layers: [satellite, earthquakes, plates]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about our map
  var legend = L.control({
  position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };
  // Add the info legend to the map
  legend.addTo(myMap);

}

// Perform a GET request to the query URL
d3.json(queryUrl, function(quakeData) {

  // Pull tectonic plate data from json
  d3.json("assets/js/PB2002_boundaries.json", function(tectonicData) {

    console.log(tectonicData)
    // Once we get a response for both jsons, send the data.features object to the createFeatures function
    createFeatures(quakeData.features, tectonicData.features);

  });

});

