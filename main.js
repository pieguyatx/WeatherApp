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
    unitSystem = "si";
    units = {"temp": "C", "dist": "km", "speed": "kph"};
  } else {
    unitSystem = "us";
    units = {"temp": "F", "dist": "mi", "speed": "mph"};
  }
  var prefixCORS = "https://cors-anywhere.herokuapp.com/"; // see https://github.com/Rob--W/cors-anywhere
  var weatherAPI = prefixCORS + "https://api.darksky.net/forecast/" + keyDarkSky + "/" + latlon + "?units=" + unitSystem;
  $.getJSON(weatherAPI, function(weatherData){
    // display temp
    var temp = Math.round(10*parseFloat(weatherData.currently.temperature))/10;
    $("#tempNo").html(temp);
    $("#tempUnit").html("&deg;"+units.temp)
    // display wind values
    var wind = weatherData.currently.windSpeed;
    $("#speed").html(wind);
    $("#windUnit").html(units.speed);
    var windBearing = parseInt(weatherData.currently.windBearing);
    var windDirection = getDirection(windBearing);
    console.log(windBearing);
    console.log(windDirection);
    $("#direction").html(windDirection);
    // get other weather data for icons
    var cloudiness = weatherData.currently.cloudCover;
    var precipProb = weatherData.currently.precipProbability;
    var stormDist = weatherData.currently.nearestStormDistance;
    var forecast = weatherData.hourly.summary;
    var icon = weatherData.currently.icon;
  })

}

function getDirection(bearing){
  var direction = "?";
  if(bearing<=10 || bearing>=360){direction = "N"}
  else if(bearing>10 && bearing<30){direction = "NNW"}
  else if(bearing>=30 && bearing<=60){direction = "NW"}
  else if(bearing>60 && bearing<80){direction = "NWW"}
  else if(bearing>=80 && bearing<=100){direction = "W"}
  else if(bearing>100 && bearing<120){direction = "SWW"}
  else if(bearing>=120 && bearing<=150){direction = "SW"}
  else if(bearing>150 && bearing<170){direction = "SSW"}
  else if(bearing>=170 && bearing<=190){direction = "S"}
  else if(bearing>190 && bearing<210){direction = "SSE"}
  else if(bearing>=210 && bearing<=240){direction = "SE"}
  else if(bearing>240 && bearing<260){direction = "SEE"}
  else if(bearing>=260 && bearing<=280){direction = "E"}
  else if(bearing>280 && bearing<300){direction = "NEE"}
  else if(bearing>=300 && bearing<=330){direction = "NE"}
  else if(bearing>330 && bearing<350){direction = "NNE"}
  return direction;
  console.log(direction);
}

// show weather icons
// font-awesome:
// storm: bolt
// rain: shower
// sun: sun-o
// cloudy: cloud
// snow: snowclake-o
// temps: thermometer-empty, -full, -half - quarter -thee-quarters
