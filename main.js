$(document).ready(function(){
  $("#start").on("click", function(){
    // set default units
    var units = "us";
    // get location
    var coordinates = getLocation();
  })
});

// get location data
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $("#city").innerHTML("Geolocation is not supported by this browser.");
  }
}
// show location
function showPosition(position) {
  // get map
  var keyGoogleStatic = config.KEYGOOGLESTATICMAPS;
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var mapAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=13&size=380x200&maptype=hybrid&markers=color:blue%7C" + latlon + "&key=" + keyGoogleStatic;
  $("#map").html("<img src='" + mapAPI + "'>");
  // get city, state
  var keyGoogleGeo = config.KEYGOOGLEGEOCODING;
  var cityAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlon + "&result_type=locality&key=" + keyGoogleGeo;
  $.getJSON(cityAPI, function(data){
    console.log(data.results[0].formatted_address); // debug
    $("#city").html(data.results[0].formatted_address);
  });
  // get weather
  getWeather(latlon);
}
// get weather data
function getWeather(latlon){
  console.log(latlon); // debug
  var keyDarkSky = config.KEYDARKSKY;
  // check units
  if(document.getElementById("requestSI").checked){
    units = "si";
  } else { units = "us"; }
  var prefixCORS = "https://cors-anywhere.herokuapp.com/";
  var weatherAPI = prefixCORS + "https://api.darksky.net/forecast/" + keyDarkSky + "/" + latlon + "?units=" + units;
  $.getJSON(weatherAPI, function(weatherData){
    var temp = weatherData.currently.temperature;
    $("#tempNo").html(temp);
    var wind = weatherData.currently.windSpeed;
    var cloudiness = weatherData.currently.cloudCover;
    var precipProb = weatherData.currently.precipProbability;
    var stormDist = weatherData.currently.nearestStormDistance;
    var forecast = weatherData.hourly.summary;
    var icon = weatherData.currently.icon;
  })

}

// show weather icons
// font-awesome:
// storm: bolt
// rain: shower
// sun: sun-o
// cloudy: cloud
// snow: snowclake-o
// temps: thermometer-empty, -full, -half - quarter -thee-quarters
