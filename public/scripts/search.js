var geocoder;
var map;
var Long = null; 
var Lat = null;
var region = null;

function initialize(access_token) {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(34.0809049,-118.3185457);
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  google.maps.event.addListener(map, 'click', function(e) {
  	Lat = e.latLng['A'];
  	Long = e.latLng['F'];
  	var latlng = new google.maps.LatLng(Lat, Long);
  	geocoder.geocode({'latLng': latlng}, function(geocode_result, status) {
  		region = geocode_result[2].formatted_address;
  		region.split(' ').join('+');
  		$('.instructions').hide();
	  	$.get("https://api.instagram.com/v1/media/search?lat="+ Lat + "&lng=" + Long + "&distance=1000&access_token=" + encodeURIComponent(access_token.toString()), function(data, status) {
					$('#pictures').empty();
					var html = " ";
					getUserStatus(data.data);
					for(var i = 0; i < data.data.length; i++) { 
						if(data.data[i]){
							if((i%3) == 0) html += '<div class="row">';
							html += '<div class="picture-container" onclick="increaseRank(this)"">';
							html += '<input type="hidden" name="username" value="'+ data.data[i].user.username +'">';
							html += '<div class="instaImage" onmouseover="showLikes(this)" onmouseout="hideLikes(this)">'+ 
										'<div id="'+ data.data[i].id + '" class="header">'+ 
											'<div class="like-container"><span class="glyphicon glyphicon-heart"></span><span class="likes">' + data.data[i].likes.count + '</span>'+
										'</div>'; 
							if(data.data[i].location.name) {}
								html += '<div class="location-container">'+ 
											'<a target="_blank" href="http://www.yelp.com/search?find_desc='+ encodeURIComponent(data.data[i].location.name.split(' ').join('+')) +'&find_loc=' + encodeURIComponent(region.split(' ').join('+')) + '">' + 
							 					'<span class="location"><img class="yelp-logo" src="https://s3.amazonaws.com/explorecdn/yelp-android.png"></img>' + data.data[i].location.name + '</span>'+
						 					'</a>'+
						 				'</div>';
							}
							html += '</div>' + 
							'<div class="image">'+
								'<a href="' + data.data[i].link + '" target="_blank">'+
									'<img src="'+ data.data[i].images.standard_resolution.url + '">'+
								'</a>' + 
							'</div>';							
							html += '</div>';
							html += '<a class="username-link" target="_blank" href="http://instagram.com/'+ data.data[i].user.username + '">' +'<div class="star '+ data.data[i].user.username+'"><div class="feed-username">@' + data.data[i].user.username + '</div></div></a>';
							html += '</div>';
							if((i%3) == 2 || i == data.data.length-1) {
								// if(i == data.data.length-1 && (i%3) != 2) { 
								// 	html += '<div class="instaImage explore"><div class="explore-more"> <span class="glyphicon glyphicon-search" style="display: block"></span>explore more </div></div>'
								// }
								if(i == data.data.length-1 && (i%3) != 2) { 
									html = ' ';
								} else {
								html += '</div>';
									$('#pictures').append(html.toString());
									html = " ";
									locality = null;
								}
							}	
						}
					}

				}, "jsonp");
	});
	placeMarker(e.latLng, map);
  });
}

function getUserStatus(data) { 
	var pageStatus = [];
	var lastUsername = data[data.length-1].user.username;
	for(var i = 0; i < data.length; i++) { 
		$.get('/status?username=' + data[i].user.username, function(res, status) { 
			pageStatus.push(res);
			if(res.username == lastUsername ){ populateStatus(pageStatus);}
		});
		
	}
}

function populateStatus(statusArray) { 
	
	for(var i = 0; i < statusArray.length; i++) { 
		if(statusArray[i].status == 'bronze') { 
			starHtml = '<span class="glyphicon glyphicon-star-empty"></span>';
			$('.' + statusArray[i].username).append(starHtml);

		}
	}
}

function increaseRank(picture_container_element) { 
	$.get('/stats?username=' + encodeURIComponent($(picture_container_element).find('input[name="username"]').val()), function(data, status){ 
	});
}

function showLikes(image_element) { 
	var parent= document.getElementsByClassName("instaImage")[0].firstElementChild.id;	
	var parent= document.getElementsByClassName("instaImage");	
	for (var i = 0; i < parent.length; i++) { 
		if(image_element == parent[i]) { 
			var id = parent[i].firstElementChild.id.toString();
			$('#' + id).css('display', 'block');
			$('#' + id).next('.image').css('opacity', '0.2');
			$('#' + id).next('.image').next('img').css('opacity', '0.2');
		}
	}
}

function hideLikes(image_element) {
	var parent= document.getElementsByClassName("instaImage")[0].firstElementChild.id;	
	var parent= document.getElementsByClassName("instaImage");	
	for (var i = 0; i < parent.length; i++) { 
		if(image_element == parent[i]) { 
			var id = parent[i].firstElementChild.id.toString();
			$('#' + id).css('display', 'none');
			$('#' + id).next('.image').css('opacity', '1');
		}
	}
}

function placeMarker(position, map) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  map.panTo(position);
}

function codeAddress() {
  	var address = document.getElementById('address').value;
  	geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      marker.setMap(null);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getQueryString() {
    var queryString= [];
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var queryParam = { 
        	query: hash[0],
        	token: hash[1]
        };
        queryString.push(queryParam);
    }
    return queryString;
}

function getQueryParam(qs, param) { 
	for(var i = 0; i < qs.length; i++) { 
		if(qs[i].query == param) return qs[i].token;
	}
}

function displayUserMenu() { 
	var element = document.getElementById('submenu'),
    style = window.getComputedStyle(element),
    display = style.getPropertyValue('display');

    if(display == 'block') { 
    	document.getElementById('submenu').style.display='none';
    }
    else {
		document.getElementById('submenu').style.display='block';
	}
}



$(document).ready(function() {
	var qString = getQueryString();
	var access_token = getQueryParam(qString, 'access_token');
	var api_token = getQueryParam(qString, 'api_key');
	if(access_token) { 
		$.get('https://api.instagram.com/v1/users/self?access_token=' + access_token, function(data, status) {
			google.maps.event.addDomListener(window, 'load', initialize(access_token));

			var header_html = '<div class="user-profile"><img id="profileImage" class="circle" src="' + data.data.profile_picture + '"></img>'+
			'<div class="dropdown" onclick="displayUserMenu()"><span class="userame">' + data.data.username + '<span class="glyphicon glyphicon-chevron-down"></span></span>'+
			'		<div id="submenu"><ul>'+ 
					'<li><a href="/logout"><span id="logout">logout</span></li>'+
					'</ul></a></div>'+
				'</div>'+
			'</div>';
		  	$('#pageHeader').append(header_html);

		}, "jsonp");
	}

	$(document).on('click', '#profileImage', function() { 
		window.location = '/feed?access_token=' + access_token;
	}); 
});
