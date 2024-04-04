require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
// Update app.js to load db.js file.
require('./app_api/models/db');
require('./app_api/config/passport');

// We only need one router for routes and controllers architecture.
//var routes = require('./app_server/routes/index');
// Set up router for API.
var routesApi = require('./app_api/routes/index');

var app = express();
app.locals.moment = require('moment');

// Sets default port to 80.
app.set('port', process.env.PORT || 80);

// view engine setup
//app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());

app.use('/icons', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/font')))
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/js'));
app.use('/js', express.static(__dirname + '/app_client'));
app.use('/css', express.static(__dirname + '/public/stylesheets'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/css'));
app.use('/nav', express.static(__dirname + '/app_client/common/nav'));
app.use('/auth', express.static(__dirname + '/app_client/common/auth'));


// We only need one router for routes and controllers architecture.
//app.use('/', routes);
// Makes it so that application will only use API routes when the route starts with /api.
app.use('/api', routesApi);
// For Angular.
// Added per Lab 5 - Angular
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});                
             
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
