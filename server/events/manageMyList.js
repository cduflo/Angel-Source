module.exports = function (server, db) {
	// var validateRequest = require("../auth/validateRequest");

	//GET ALL
	server.get('/mylist', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			db.mylist.find(function (err, mylist){
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify(mylist));
			});
		// });
		return next();
	});

	//GET ONE
	server.get('/mylist/:id', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
		    db.mylist.findOne({
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
	server.post('/mylist', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			var mylist = req.params;
			db.mylist.save(mylist,
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
	server.put('/mylist/:id', function (req, res, next){
		// validateRequest.validate(req,res,db, function() {
			//get existing product
			db.mylist.findOne({
				id: req.params.id
			}, function (err, data){
				//merge req.params/mylist with the server/mylist
				var updmylist = {};  //updated mylist
				//logic similar to jQuery.extend9); to merge 2 objects
				for (var n in data) {
					updmylist[n] = data[n];
				}
				for (var n in req.params) {
					updmylist[n] = req.params[n];
				}
				db.mylist.update({
					id: req.params.id
				}, updmylist, {
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
	server.del('/mylist/:id', function (req, res, next) {
		// validateRequest.validate(req,res,db, function() {
			db.mylist.remove({
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
