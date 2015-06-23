var express = require('express');
var app = express();
var session = require('client-sessions');
var http = require('http');
var locals = require('./locals');
var _url = require('url');
var request = require('request');
var bodyParser = require('body-parser');

function hash(username, key) { 
  var sum = 0;
  for(var i = 0; i < username.length; i++){ 
    sum += username.charCodeAt(i);
  }
  return sum % key;

}

app.use(express.static(__dirname + '/public'));

app.use(session({
  cookieName: 'session',
  secret: 'This_Is_A_Test_String',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

//Update Views Count
app.use(function(req, res, next) {
	request.post(_url.resolve(locals.BASE_API, "/views"), function(err, res, body) {
	  next();
	});
});


app.get('/', function(req, res) { 
	res.sendfile('./views/index.html');
});

app.get('/search', function(req, res) { 
  if(req.session.user && req.query.access_token) {
	 res.sendfile('./views/search.html');
  }
  else {
    res.redirect('/'); 
  }
});

app.get('/feed', function(req, res) { 
  if(req.session.user && req.query.access_token) {
    res.sendfile('./views/feed.html')
  }
  else {
    res.redirect('/'); 
  }
});

app.get('/login', function(req, res) { 
  if(req.query.code) { 
    request({
      url: locals.instagram.ACCESS_TOKEN_API, //URL to hit
      method: 'POST',
      form: {
          client_id: locals.instagram.client_id,
          client_secret: locals.instagram.client_secret,
          grant_type: locals.instagram.grant_type,
          redirect_uri: locals.instagram.redirect_uri,
          code: req.query.code
      }
    }, function(error, response, body){
        if(error) {
          res.redirect('/')
        } 
        else {
          bodyJSON = JSON.parse(body);
          //set the req.session
          if(bodyJSON.user.username) { 
            req.session.user = bodyJSON.user.username;
            req.session.user_id = bodyJSON.user.id;
          

            //hash access_token, hit user api 
            request({ url: _url.resolve(locals.BASE_API, '/user'), 
              method: 'PUT', 
              json: {
                username: bodyJSON.user.username, 
                id: bodyJSON.user.id, 
                profilePicture: bodyJSON.user.profile_picture,
                api_key: hash(bodyJSON.user.username, locals.key),
                access_token: bodyJSON.access_token
              }}, function(err, userRes, body) { 
                if(body.status == "not authorized") { 
                  //TO DO ERROR PAGE
                  res.redirect('/');
                }
                else {
                  res.redirect('/search?access_token='+ bodyJSON.access_token + '&api_key=' + hash(bodyJSON.user.username, locals.key));
                }
            });
          }
          else {
            res.redirect('/');
          }
        }
    });
  }
  else {
    res.redirect('/search');
  }
});

app.get('/logout', function(req, res) { 
  req.session.reset();
  res.sendfile('./views/index.html');
});

app.get('/stats', function(req, res) { 
  request({
      url: _url.resolve(locals.BASE_API, "/hash"), //URL to hit
      method: 'POST',
      //Lets post the following key/values as form
      form: {
          username: req.query.username
      }
    }, function(error, response, body){

      if(body){ 
        resBody = JSON.parse(body);
        res.send({clicks: resBody.clicks});
      }
      else {
        res.send({clicks: 0});
      }
      
    });
});

app.get('/status', function(req, res) { 
  request({
      url: _url.resolve(locals.BASE_API, "/hash?username=" + req.query.username), //URL to hit
      method: 'GET'
    }, function(error, response, body){
    if(body){ 
        resBody = JSON.parse(body);
        res.send({
          status: resBody.status,
          username: req.query.username
        });
      }
      else {
        res.send({status: 'none'});
      }
    
  });
});

app.listen(8080);