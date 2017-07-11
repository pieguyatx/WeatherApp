$(document).ready(function(){

  // get location
  getLocation();


  var keyGoogle = config.KEYGOOGLE;

  // get weather
  var keyDarkSky = config.KEYDARKSKY;

});

// get location data
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      $("#location").innerHTML = "Geolocation is not supported by this browser.";
  }
}
// show location
function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
      latlon + "&zoom=14&size=400x300&sensor=false&key=" + keyGoogle;
    $("#map").innerHTML = "<img src='"+img_url+"'>";
    $("#city").innerHTML = latlon;
    console.log(latlon);
}
