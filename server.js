var express = require('express'); 
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const http = require('http');
const hostname = '192.168.1.245';//'127.0.0.1';//'10.156.0.248';
const port = 3000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);
app.post('/test', function(req, res) {
  console.log("sent:" + req.body.val);
  //res.status(200).send('ok');
});
app.get('*', function(req, res) {
    res.sendFile('./test.html', {root: __dirname })
    //res.sendFile('./test.html');
    //res.status(200).send('ok');
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
