$(document).ready(function(){
  $("#start").on("click", function(){
    // get location
    var coordinates = getLocation();
  })
});

// get location data
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $("#city").innerHTML = "Geolocation is not supported by this browser.";
  }
}
// show location
function showPosition(position) {
  var keyGoogleStatic = config.KEYGOOGLESTATICMAPS;
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var mapsrc = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7C" + latlon + "&key=" + keyGoogleStatic;
  $("#map").html("<img src='" + mapsrc + "'>");
  // get weather
  getWeather(position.coords);
}
// get weather
function getWeather(coords){
  var keyDarkSky = config.KEYDARKSKY;
  console.log("lat/lon = " + coords.latitude + " " + coords.longitude); // debug
}
