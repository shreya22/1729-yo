var express = require('express');
var logger = require('morgan');
var app = express();

// app.use(logger);
// app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/scripts/controllers'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', function(req, res){
	res.render('./app/index.html');
})
app.listen(5000, function(){
	console.log('express server listening on port ', 5000);
});
