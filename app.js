'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');
var port        = process.env.PORT || 3000;

// EXPRESS CONFIGURATION
var app = express();

// Configure Express
app.use(bodyParser.raw({type: 'application/jwt'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

//app.get('/', routes.index );
app.post('/login', routes.login );
app.post('/logout', routes.logout );

// Custom Routes for MC
app.post('/save', activity.save );
app.post('/validate', activity.validate );
app.post('/publish', activity.publish );
app.post('/execute', activity.execute );
app.post('/stop', activity.validate );


/*http.createServer(app).listen(
  app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  }
);*/

app.listen(port, () => {
  console.log(`IVR app listening on port ${port}`)
})
