/**
 * Module dependencies.
 */

var express = require('express')
    , callLog = require('./log');
//    , routes = require('./routes');


var app = module.exports = express.createServer();

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express['static'](__dirname + '/views'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret:'your secret here' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// Routes

//app.get('/', routes.index);

app.get('/', function (req, res) {
    res.render('index', { title:'Wakenya Tuongee?', layout:'layout' })
});

app.get('/log', function (req, res) {
    res.writeHead(200, {'content-type': 'application/json' });
    res.write( JSON.stringify(callLog.data) );
    res.end('\n');
});

app.get('/compare', function(req, res) {
    res.render('compare', { title:'Wakenya Tuongee vs Tuongee', layout:'layout' });
});

app.get('/graph', function(req, res) {
    res.render('graph', { title: 'Comparision Chart', layout: 'layout'});
});

app.get('/test', function(req, res) {
    res.render('test', { title: 'Tests', layout: 'test_layout'});
});

app.listen(3001, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
