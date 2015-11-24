var express = require('express');
var path = require('path');

var app = express();
app.use('/',express.static(path.join(__dirname, 'public')));


app.listen(9000);
console.log("server running on port 9000");