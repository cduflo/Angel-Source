module.exports = function (server, db) {
	// var validateRequest = require("../auth/validateRequest");

	//GET ALL
	server.get('/events', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			db.events.find(function (err, events){
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify(events));
			});
		// });
		return next();
	});

	//GET ONE
	server.get('/event/:id', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
		    db.events.findOne({
		        id: req.params.id
		    }, function (err, data) {
		        res.writeHead(200, {
		            'Content-Type': 'application/json; charset=utf-8'
		        });
		        res.end(JSON.stringify(data));
		    });
		// });
	    return next();
	});

	//POST
	server.post('/events', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			var event = req.params;
			db.events.save(event,
				function (err, data) {
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=utf-8'
					});
					res.end(JSON.stringify(data));
				});
		// });
		return next();
	});

	//PUT
	server.put('/event/:id', function (req, res, next){
		// validateRequest.validate(req,res,db, function() {
			//get existing product
			db.events.findOne({
				id: req.params.id
			}, function (err, data){
				//merge req.params/event with the server/event
				var updEvent = {};  //updated events
				//logic similar to jQuery.extend9); to merge 2 objects
				for (var n in data) {
					updEvent[n] = data[n];
				}
				for (var n in req.params) {
					updEvent[n] = req.params[n];
				}
				db.events.update({
					id: req.params.id
				}, updEvent, {
					multi: false
				}, function (err, data) {
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=utf-8'
					});
					res.end(JSON.stringify(data));
				});
			});
		// });
		return next();
	});

	//DELETE
	server.del('/event/:id', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			db.events.remove({
				id: req.params.id
			}, function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'applicaiton/json; charset=utf-8'
				});
				res.end(JSON.stringify(true));
			});
		// });
		return next();
	});

}
