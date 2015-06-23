
function showLikes(image_element) { 
	var parent= document.getElementsByClassName("instaImage")[0].firstElementChild.id;	
	var parent= document.getElementsByClassName("instaImage");	
	for (var i = 0; i < parent.length; i++) { 
		if(image_element == parent[i]) { 
			var id = parent[i].firstElementChild.id.toString();
			$('#' + id).css('display', 'block');
			$('#' + id).next('.image').css('opacity', '0.2');
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

$(document).ready(function() {
	var qString = getQueryString();
	var access_token = getQueryParam(qString, 'access_token');
	var api_token = getQueryParam(qString, 'api_key');
	if(access_token) { 
		$.get('https://api.instagram.com/v1/users/self/feed?access_token=' + access_token, function(data, status) {
			$('#pictures').empty();
					var html = " ";
					for(var i = 0; i < data.data.length; i++) { 
						if(data.data[i]){
							if((i%3) == 0) html += '<div class="row">';
							html += '<div class="instaImage" onmouseover="showLikes(this)" onmouseout="hideLikes(this)">'+
										'<div id="'+ data.data[i].id + '" class="header">'+ 
											'<div class="like-container">'+
												'<span class="glyphicon glyphicon-heart"></span>'+
												'<span class="likes">' + data.data[i].likes.count + '</span>'+
											'</div>'; 
							html += '</div>' + 
							'<div class="image">'+
								'<a href="' + data.data[i].link + '" target="_blank"><img src="'+ data.data[i].images.standard_resolution.url + '"></a>' + 
							'</div>';
							html += '<a target="_blank" href="http://instagram.com/'+ data.data[i].user.username + '">' +
										'<div class="feed-username">@' + data.data[i].user.username + 
										'</div>'+
									'</a>';
							html += '</div>';
							if((i%3) == 2 || i == data.data.length-1) {
								if(i == data.data.length-1 && (i%3) != 2) { 
									html = ' ';
								}
								else { 
									html += '</div>';
									$('#pictures').append(html.toString());
									html = " ";
								}
							}	
						}
					}

		}, "jsonp");
	}
});
