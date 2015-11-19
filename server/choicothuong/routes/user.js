
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.create = function(req , res) {
	console.log("create users");
//	var userId = req.body.userId;
	var userId = req.body.facebook;
	console.log("create users:" + userId);
};