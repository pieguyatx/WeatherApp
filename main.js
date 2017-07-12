// get time of day for use later
var date = new Date();
var hrs = date.getHours();

$(document).ready(function(){
  // set initial colors, other aesthetics based on time of day
  date = new Date();
  hrs = date.getHours();
  setColors(hrs);
  // set initial skycon
  var skycons = new Skycons({"color": "white"});
  skycons.add("skycon",Skycons.PARTLY_CLOUDY_DAY);
  skycons.play();
  // get weather on click; update colors
  $("#start").on("click", function(){
  setColors(hrs);
    // set default units
    var unitSystem = "us";
    // get location
    var coordinates = getLocation();
  })
});

function setColors(hrs){
  // set background color
  var rgbmax = [119,245,255]; // cyan
  var rgbmin = [22,6,112]; // dark blue
  var rgbval = [255,255,255];
  for(let i=0; i<3; i++){
    rgbval[i] = Math.round(0.5*(rgbmax[i]-rgbmin[i])*Math.cos((hrs-14.7)*Math.PI/12)+(rgbmax[i]+rgbmin[i])/2);
  }
  rgbstr = "rgb(" + rgbval.join(",") + ")";
  document.body.style.backgroundColor = rgbstr;
  // set drop shadow properties
  var shadowmax = [40,100,50];
  var shadowmin = [-40,10,15];
  var shadowval = shadowmax;
  // set shadow horizontal position (from one side to the other during the day)
  shadowval[0] = Math.round(0.5*(shadowmax[0]-shadowmin[0])*Math.cos((hrs-7.2)*Math.PI/12)+(shadowmax[0]+shadowmin[0])/2);
  // set shadow vertical position and blur (incrase and decrease during the day)
  shadowval[1] = Math.round(0.5*(shadowmax[1]-shadowmin[1])*Math.cos((hrs-1.2)*Math.PI/6)+(shadowmax[1]+shadowmin[1])/2);
  shadowval[2] = Math.round(0.5*(shadowmax[2]-shadowmin[2])*Math.cos((hrs-7.6)*Math.PI/6)+(shadowmax[2]+shadowmin[2])/2);
  for(let i=0; i<3; i++){
    rgbval[i] = Math.round(rgbval[i]-100);
    if(rgbval[i]<0){
      rgbval[i] = 0;
    }
  }
  var shadowout = "0px 0px 5px black, " + shadowval[0] + "vw " + shadowval[1] + "px " + shadowval[2] + "px rgb(" + rgbval.join(",") +")";
  $("body").css("text-shadow",shadowout);
  shadowval[0] = Math.round(shadowval[0]*1.1);
  shadowval[1] = Math.round(shadowval[1]*1.2);
  shadowval[2] += 25;
  shadowout = "0px 0px 5px black, " + shadowval[0] + "vw " + shadowval[1] + "px " + shadowval[2] + "px rgb(" + rgbval.join(",") +")";
  $("button, .slider").css("box-shadow",shadowout);
}

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
  var units;
  var distScale;
  if(document.getElementById("requestSI").checked){
    unitSystem = "si";
    units = {"temp": "C", "dist": "km", "speed": "kph"};
    distScale = 1;
  } else {
    unitSystem = "us";
    units = {"temp": "F", "dist": "mi", "speed": "mph"};
    distScale = 1.609; // km in mile
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
    $("#direction").html(windDirection);
    // get other weather data for icons
    var icon = weatherData.currently.icon;
    var cloudiness = weatherData.currently.cloudCover;
    var precipProb = weatherData.currently.precipProbability;
    var stormDist = weatherData.currently.nearestStormDistance / distScale; // distance in miles
    // display icons
    displayIcons(icon,temp,cloudiness,precipProb,stormDist);
    //var forecast = weatherData.hourly.summary;
  })
}

// get cardinal directions from bearing in degrees 0=north, 90=east
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
}

// display icons according to weather
function displayIcons(icon,temp,cloudiness,precipProb,stormDist){
  // show weather icons w/ font-awesome:
  // temps: thermometer-empty, -full, -half - quarter -thee-quarters
  var tempIcon = "thermometer-half";
  if(document.getElementById("requestSI").checked){
    temp = temp*1.8 + 32; // convert to F
  }
  if(temp>85){ tempIcon = "thermometer-full"}
  else if(temp<=85 && temp>60){ tempIcon = "thermometer-three-quarters"}
  else if(temp<=60 && temp>50){ tempIcon = "thermometer-half"}
  else if(temp<=50 && temp>32){ tempIcon = "thermometer-quarter"}
  else if(temp<=32){ tempIcon = "thermometer-empty"}
  var outputHTML = '<i class="fa fa-'+tempIcon+'" aria-hidden="true"></i>';
  $("#iconTemp").html(outputHTML);
  // determine summary icon
  if(stormDist<1){ weatherIcon = "bolt"}
  else if(precipProb>0.7){
    if(temp<32){ weatherIcon = "snowflake-o" }
    else{weatherIcon = "shower" } }
  else if(precipProb>0.6){ weatherIcon = "shower" }
  else if(cloudiness>0.6){ weatherIcon = "cloud"}
  else {
    if(hrs<=6 || hrs>=22){ weatherIcon = "moon-o"}
    else{
      weatherIcon = "sun-o"
    }
  }
  // output simple icons
  outputHTML = '<i class="fa fa-'+weatherIcon+'" aria-hidden="true"></i>';
  $("#iconWeather").html(outputHTML);
  // output Skycon
  var skycons = new Skycons({"color": "white"});
  icon = icon.replace(/-/g,"_").toUpperCase();
  skycons.add("skycon", Skycons[icon]);
  skycons.play();
}
