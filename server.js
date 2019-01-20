var express = require('express'); 
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var con = mysql.createConnection({
  host: 'localhost',
  user: 'michael',
  password: 'ziggythedog',
  database: 'test'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
const http = require('http');
const hostname = '127.0.0.1';//'192.168.1.245';//'127.0.0.1';//'10.156.0.248';
const port = 3000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);
app.post('/test', function(req, res) {
  console.log("sent: " + req.body.val);
  //res.status(200).send('ok');
});
app.post('/droneRoute', function(req, res) {
	var routeId;
	con.query("SELECT (max(routeid) + 1) as id from example", function(error, result){
		if(error == null)
			routeId = result[0].id;
	});
	req.body.vertices.vectors.forEach(function(vector) {
		console.log("X: " + vector.x + " Y: " + vector.y + " Z: " + vector.z);
		con.query("INSERT INTO example (x, y, z, routeid) VALUES ('" + vector.x + "', '" + vector.y  + "', '" + vector.z + "', '" + routeId + "')");
	});
	
	//console.log("sent: " + req.body.vertices.vectors);
});
app.get('/droneRoute', function(req, res) {
	//con.query("INSERT INTO example (x, y, z, routeid) VALUES ('0', '1', '2', '0')");
	con.query("SELECT x, y, z, routeid from example where routeid = 0", function(error, result){
		result.forEach(function(vector){
			console.log(vector.x + vector.y)
		});
	});
	res.status(200).send('ok..');
});
app.get('/three', function(req, res) {
    res.sendFile('./testThree.html', {root: __dirname});
});
app.get('*', function(req, res) {
    res.sendFile('./test.html', {root: __dirname });
    //res.sendFile('./test.html');
    //res.status(200).send('ok');
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
