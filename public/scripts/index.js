
$(document).ready(function() {
	$( "#instagramLogin" ).on( "click", function() {
		$('.homepage').fadeOut(1000);
		window.location.replace('https://api.instagram.com/oauth/authorize/?client_id=269b540d4fbf45958074742f4b8061e9&redirect_uri=http://ec2-52-5-95-215.compute-1.amazonaws.com/login&response_type=code');
	});
});
