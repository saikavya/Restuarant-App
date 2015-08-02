var geocoder;
var map;
var latitude=32.75;
var longitude=-97.13;
var setOneTimeRun=true;
var southWestLat;
var southWestLong;
var	northEastLat;
var northEastLong;
function initialize () {		
		geocoder = new google.maps.Geocoder();//accessing Gmaps api gecoding service in code.
		var mapOptions = {
//to initialise a map we create mapoptions object which requires zoom and center.
					zoom: 16,
					center: new google.maps.LatLng(latitude,longitude)
				  };
				  map = new google.maps.Map(document.getElementById('map-canvas'),
					  mapOptions);//create js map object passing div element and map properties.
		CurrentLocation();
		
}
function CurrentLocation() {
    if (navigator.geolocation) { //check if geolocation is supported by browser
        navigator.geolocation.getCurrentPosition(centerMe,noresult);
    } else {
        alert("You don't support this");
    }
}

function centerMe(position) {
var lat =  position.coords.latitude;
var lon = position.coords.longitude;
var coordss = new google.maps.LatLng(lat,lon);
    map.setCenter(coordss);
	southWestLat=map.getBounds().getSouthWest().lat();
    southWestLong=map.getBounds().getSouthWest().lng();
	northEastLat=map.getBounds().getNorthEast().lat();
	northEastLong=map.getBounds().getNorthEast().lng();
}
function noresult()
{
alert("No result found");
}
function sendRequest () {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);
   xhr.open("GET", "proxy.php?term="+query+"&bounds="+southWestLat+","+southWestLong+"|"+northEastLat+","+northEastLong+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		 // oltest();
          //document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
		  locations(json);
		  information(json);
	      initialize();
          onmap(json);
       }
   };
   xhr.send(null);
}
function locations(json)
{
document.getElementById("list").innerHTML='';
	latitude=json.region.center.latitude;
	longitude=json.region.center.longitude;
}
function information(json)
{
for (var i = 0;i<json.businesses.length;i++) {
	 var listitem = document.createElement("li");
	 var image = document.createElement("img");
	 image.style.width="250px";
	 image.style.height="150px";
	 image.style="display:visible"
	 image.src=json.businesses[i].image_url;
	 
	 var rating=document.createElement("img");
	 rating.style.width="65px";
	 rating.style.height="35px";
	 style="display:visible"
	 rating.src=json.businesses[i].rating_img_url;
	 var clickable=document.createElement("a");
	 clickable.href=json.businesses[i].url;
	 clickable.innerHTML=json.businesses[i].name+"<br>";
	 clickable.target="_blank";
	 var snippet=document.createElement("label");
	 snippet.innerHTML="<br>"+json.businesses[i].snippet_text;
	 listitem.appendChild(clickable);
	 listitem.appendChild(image);
	 document.createElement("br");
	 listitem.appendChild(rating);
	 listitem.appendChild(snippet);
	 document.getElementById("list").appendChild(listitem);
		}
}
function onmap(json) {
	var address;
	var marker=null;
	for (var i = 0; i<json.businesses.length; ++i) {	
    address = ""+json.businesses[i].location.display_address;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) //gecoder has returned results
	  {
        map.setCenter(results[0].geometry.location);//sets marker on map.
        marker = new google.maps.Marker({ 
            map:map,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
	}
  }
function loadScript() {
		if(setOneTimeRun){
//javascript api of google maps and instruct initialize function 
//to execute only when api has completely loaded by passing callback=initialize.
		  var script = document.createElement('script');//script tag is location of js that loads all map properties and symbols from gmaps
		  script.type = 'text/javascript';//javascript object literal to hold number of map properties
		  script.src = 'https://maps.googleapis.com/maps/api/js?AIzaSyB7wMkIKFfvN0QjFq6R1B-86G2&sensor=false&' +
			  'callback=initialize';
		  document.body.appendChild(script);
		  setOneTimeRun=false;
		  }
		  else{initialize();}
		}