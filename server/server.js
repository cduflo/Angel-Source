var restify = require('restify');
var mongojs = require('mongojs');
var morgan  = require('morgan');

//Connection to MongoLab DB
var db = mongojs('mongodb://cduflo:Origin1914@ds023398.mlab.com:23398/angelsource', ['appUsers', 'events', 'mylist']);
//Server
var server = restify.createServer();



server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev'));

//CORS
server.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

server.listen(process.env.PORT || 9804, function() {
	console.log("Server started @ ", process.env.PORT || 9804);
});
//
// var manageUsers = require('./auth/manageUser')(server, db);
var manageEvents = require('./events/manageEvents')(server, db);
var manageEvents = require('./events/manageMyList')(server, db);

module.exports = server;
