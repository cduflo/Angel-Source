module.exports = function (server, db) {
    // var validateRequest = require("../auth/validateRequest");
    var mongojs = require('mongojs');

    //GET ALL
    server.get('/mylist/:userId', function (req, res, next) {
        // validateRequest.validate(req,res,db, function() {
        db.mylist.find({
            userId: req.params.userId
        }, function (err, mylist) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(mylist));
        });
        // });
        return next();
    });

    //POST
    server.post('/mylist/:userId', function (req, res, next) {
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

    //DELETE 
    server.del('/mylist/:id', function (req, res, next) {
        db.mylist.remove({
            _id: mongojs.ObjectId(req.params.id)
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(true));
        });
        return next();
    });

    server.listen(9998, function () {
        console.log("Server started @ 9998");
    });

}