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
const X = 0;
const Y = 1;
const Z = 2;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);
app.post('/test', function(req, res) {
  console.log("sent: " + req.body.val);
  //res.status(200).send('ok');
});
class Vertex{
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.segments = [];
		/*
		this.xP = null;
		this.xN = null;
		this.yP = null;
		this.yN = null;
		this.zP = null;
		this.zN = null; */
	}
}
class Segment{
	constructor(vertexA, vertexB)
	{
		this.vertexA = vertexA;
		this.vertexB = vertexB;
		this.usedBy = 0;
	}
}
class Route{
	/*assigns values at construction*/
	constructor(startX, startY, startZ, endX, endY, endZ){
    		this.startLocation = {x: startX, y: startY, z: startZ};
		this.endLocation = {x: endX, y: endY, z: endZ};
		this.currentLocation = {x: startX, y: startY, z: startZ};
		this.vertices = [];
		this.closeness = 5;
		this.airSpace = {x : 100, y: 100, z: 100};
 	}
	static initialize() { 
		for(var k = 0; k < parseInt(this.airSpace.z); k += this.closeness)
		{
			for(var j = 0; j < parseInt(this.airSpace.y); j += this.closeness)
			{
				for(var i = 0; i < parseInt(this.airSpace.x); i += this.closeness)
				{
					Route.allVertices.vertices.push(new Vertex(i, j, k));
				}
			}
		}
		for(var i = 0; i < Route.allVertices.vertices.length; i++)
		{
			var curVertex = Route.allVertices.vertices[i];
			var curX = parseInt(curVertex.x);
			var curY = parseInt(curVertex.y);
			var curZ = parseInt(curVertex.z);
			for(var j = 0; j < Route.allVertices.vertices.length; j++)
			{
				if(i != j)
				{
					var checkVertex = Route.allVertices.vertices[j];
					var checkX = parseInt(checkVertex.x);
					var checkY = parseInt(checkVertex.y);
					var checkZ = parseInt(checkVertex.z);
					var closeToX = (curX + this.closeness >= checkX) && (curX - this.closeness <= checkX);
					var closeToY = (curY + this.closeness >= checkY) && (curY - this.closeness <= checkY);
					var closeToZ = (curZ + this.closeness >= checkZ) && (curZ - this.closeness <= checkZ);
					if(closeToX && closeToY && closeToZ)
					{
						var contains = false;
						checkVertex.segments.forEach(function (segment){
							if(segment.vertexA == curVertex)
								contains = true;
							if(segment.vertexB == curVertex)
								contains = true;
						});
						//curVertex.segments.push(new)
					}
					/*
					for(var k = 0; k < checkVertex.segments.length; k++)
					{
						if(checkVertex.segments[k].vertexA.x == )
					}*/
				}
			}
		}
		Route.allVertices.vertices.forEach(function(vertex) {
			

		});
	}
	/*Createsa route*/
	createRoute(routes) {
		
		this.createDirection = -1;//used to create routes

		var createNode = {x: this.startLocation.x, y: this.startLocation.x, z: this.startLocation.z}
		this.vertices.push({x: createNode.x, y: createNode.y, z: createNode.z});
		var i = 0;
		while(createNode.x != this.endLocation.x || createNode.y != this.endLocation.y || createNode.z != this.endLocation.z)
		{
			
			/*var closeEnoughX = (parseInt(createNode.x) + this.closeness == parseInt(this.endLocation.x)) || (parseInt(createNode.x) - this.closeness == parseInt(this.endLocation.x)) || createNode.x == this.endLocation.x
			var closeEnoughY = (parseInt(createNode.y) + this.closeness == parseInt(this.endLocation.y)) || (parseInt(createNode.y) - this.closeness == parseInt(this.endLocation.y)) || createNode.y == this.endLocation.y
			var closeEnoughZ = (parseInt(createNode.z) + this.closeness == parseInt(this.endLocation.z)) || (parseInt(createNode.z) - this.closeness == parseInt(this.endLocation.z)) || createNode.z == this.endLocation.z
			if(closeEnoughX && closeEnoughY && closeEnoughZ)
			{
				createNode.x = this.endLocation.x
				createNode.y = this.endLocation.y
				createNode.z = this.endLocation.z
				break;
			}
			*/
			console.log(createNode.x + " " + createNode.y + " " + createNode.z);
			if(this.iterateRoute(createNode, routes) == -1)
			{
				return;
			}
			i++;
			if(i == 100)
				break;
		}
		this.vertices.push({x: createNode.x, y: createNode.y, z: createNode.z});
		routes.routes.push(this);
	}
	evaluateSafeness(routes, modified) {
		var safeDirections = {x: true, y: true, z: true};	
		var closeness = this.closeness;
		routes.routes.forEach(function(route) {
			for(var i = 1; i < route.vertices.length; i++)
			{
				var begin = route.vertices[i - 1];
				var end = route.vertices[i];
				var safeX = true;
				var safeY = true;
				var safeZ = true;
				//console.log(begin.x + closeness);
				if(parseInt(begin.x) + closeness > parseInt(modified.x) && parseInt(end.x) - closeness < parseInt(modified.x)) {
					safeX = false;
				}
				if(parseInt(begin.x) - closeness < parseInt(modified.x) && parseInt(end.x) + closeness > parseInt(modified.x)) {
					safeX = false;
				}
				if(parseInt(begin.y) + closeness > parseInt(modified.y) && parseInt(end.y) - closeness < parseInt(modified.y)) {
                                        safeY = false;
                                }
                                if(parseInt(begin.y) - closeness < parseInt(modified.y) && parseInt(end.y) + closeness > parseInt(modified.y)) {
                                        safeY = false;
                                }
				if(parseInt(begin.z) + closeness > parseInt(modified.z) && parseInt(end.z) - closeness < parseInt(modified.z)) {
                                        safeZ = false;
                                }
                                if(parseInt(begin.z) - closeness < parseInt(modified.z) && parseInt(end.z) + closeness > parseInt(modified.z)) {
                                        safeZ = false;
                                }
				console.log("X: " + begin.x + "|" + end.x + " " + begin.y + "|" + end.y + " " + begin.z + "|" + end.z);
				console.log("safe X: " + safeX + " " + safeY + " " + safeZ + " ");
				if(!(safeX || (!safeX && (safeY || safeZ))))
				{
					safeDirections.x = false;
				}
				if(!(safeY || (!safeY && (safeX || safeZ))))
				{
					safeDirections.y = false;
				}
				if(!(safeZ || (!safeZ && (safeY || safeX))))
				{
					safeDirections.z = false;
				}
			}
		});
		return safeDirections;

	}
	/*iterates through other routes to see where the route can be built*/
	iterateRoute(node, routes) {
		/* Evaluating which direction a drone should move in each axis */
		var xDifference = 0;
		var yDifference = 0;
		var zDifference = 0;
		if(this.endLocation.x - node.x > 0)
		{
			xDifference = 1;
		}
		else if(this.endLocation.x - node.x < 0)
		{
			xDifference = -1;
		}
		if(this.endLocation.y - node.y > 0)
		{
			yDifference = 1;
		}
		else if(this.endLocation.y - node.y < 0)
		{
			yDifference = -1;
		}
		if(this.endLocation.z - node.z > 0)
		{
			zDifference = 1;
		}
		else if(this.endLocation.z - node.z < 0)
		{
			zDifference = -1;
		}
		//console.log(node.x + " " + xDifference);
		for(var i = 0; i < 2; i++)
		{
			var xModified;
			var yModified;
			var zModified;
			if(i == 0)
			{
				xModified = parseInt(node.x) + parseInt(xDifference);
				yModified = parseInt(node.y) + parseInt(yDifference);
				zModified = parseInt(node.z) + parseInt(zDifference);
			}
			/*
			else
			{
				xModified = parseInt(node.x) - parseInt(xDifference) * (this.closeness + 1);
				yModified = parseInt(node.y) - parseInt(yDifference) * (this.closeness + 1);
				zModified = parseInt(node.z) - parseInt(zDifference) * (this.closeness + 1);
			}
			*/
				//console.log("x: " + xModified + " y: " + yModified + " z: " + zModified);
			/*Evaluate if there is a collision among other routes*/
			/*does not take into account current drone locations*/
			/*does not take into account obstacles*/
			/*does not take into account safe distance*/
			console.log("Can Change: " + xDifference + " " + yDifference + " " + zDifference + " ");
			var modified;
			var safeDirections;
			if(xDifference != 0)
			{
				modified = {x: xModified, y: parseInt(node.y), z: parseInt(node.z)};
				safeDirections = this.evaluateSafeness(routes, modified);
				console.log("X change: " + safeDirections.x + " " + safeDirections.y + " " + safeDirections.z);
				if(safeDirections.x)
				{				
					if(this.createDirection == -1)
						this.createDirection = X;
					else if(this.createDirection != X)
					{
						this.createDirection = X;
						this.vertices.push({x: node.x, y: node.y, z: node.z});
					}
					node.x = modified.x;
					return X;
				}
			}
			if(yDifference != 0)
			{
				modified = {x: parseInt(node.x), y: yModified, z: parseInt(node.z)};
				safeDirections = this.evaluateSafeness(routes, modified);
				console.log("Y change: " + safeDirections.x + " " + safeDirections.y + " " + safeDirections.z);
				if(safeDirections.y)
				{				
					if(this.createDirection == -1)
						this.createDirection = Y;
					else if(this.createDirection != Y)
					{
						this.createDirection = Y;
						this.vertices.push({x: node.x, y: node.y, z: node.z});
					}
					node.y = modified.y;
					return Y;
				}
			}
			if(zDifference != 0)
			{
				modified = {x: parseInt(node.x), y: parseInt(node.y), z: zModified};
				safeDirections = this.evaluateSafeness(routes, modified);
				console.log("Z change: " + safeDirections.x + " " + safeDirections.y + " " + safeDirections.z);
				if(safeDirections.z)
				{				
					if(this.createDirection == -1)
						this.createDirection = Z;
					else if(this.createDirection != Z)
					{
						this.createDirection = Z;
						this.vertices.push({x: node.x, y: node.y, z: node.z});
					}
					node.z = modified.z;
					return Z;
				}
			}
			var closeEnoughX = (parseInt(node.x) + this.closeness == parseInt(this.endLocation.x)) || (parseInt(node.x) - this.closeness == parseInt(this.endLocation.x));
			var closeEnoughY = (parseInt(node.y) + this.closeness == parseInt(this.endLocation.y)) || (parseInt(node.y) - this.closeness == parseInt(this.endLocation.y));
			var closeEnoughZ = (parseInt(node.z) + this.closeness == parseInt(this.endLocation.z)) || (parseInt(node.z) - this.closeness == parseInt(this.endLocation.z));
			if(closeEnoughX)
			{
				if(this.createDirection != X)
				{
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.x = this.endLocation.x;
				console.log("close enough");
				return X;
			}
			if(closeEnoughY)
			{
				if(this.createDirection != Y)
				{
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.y = this.endLocation.y;
				console.log("close enough");
				return Y;
			}
			if(closeEnoughZ)
			{
				if(this.createDirection != Z)
				{
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.z = this.endLocation.z;
				console.log("close enough");
				return Z;
			}
			/*Determine where a valid change to route can be*/
			/*add a vertex if needed*/
			/*
			if(safeDirections.x && xDifference != 0)
			{
				if(this.createDirection == -1)
					this.createDirection = X;
				else if(this.createDirection != X)
				{
					this.createDirection = X;
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.x = modified.x;
			//console.log(xModified);
				return X;
			}
			if(safeDirections.y && yDifference != 0)
			{
				if(this.createDirection == -1)
					this.createDirection = Y;
				else if(this.createDirection != Y)
				{
					this.createDirection = Y;
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.y = modified.y;
			//console.log(modified.y);
				return Y;
			}
			if(safeDirections.z && zDifference != 0)
			{
				if(this.createDirection == -1)
					this.createDirection = Z;
				else if(this.createDirection != Z)
				{
					this.createDirection = Z;
					this.vertices.push({x: node.x, y: node.y, z: node.z});
				}
				node.z = modified.z;
				//console.log(zModified);
				return Z;
			}
			*/
			console.log("Need to avoid obstacle");
			if(this.createDirection == X || this.createDirection == Y)
			{
				this.vertices.push({x: node.x, y: node.y, z: node.z});
			}
			this.createDirection = Z;
			node.z = parseInt(node.x) + (parseInt(this.closeness) + 1) * parseInt(zDifference);
			return Z;
		}
		Route.allVertices = {};

		/*placeholder for now*/
		/*
		else
		{
			if(this.createDirection == -1)
				this.createDirection = X;
			else if(this.createDirection != X)
			{
				this.createDirection = X;
				this.vertices.push({x: node.x, y: node.y, z: node.z});
			}
			node.x = xModified;
			console.log(xModified);
			return X;
		}*/
		/*
		console.log("Failed x: "  + node.x + " y: " + node.y + " z: " + node.z);
		return -1;
		*/
	}
	/*JUNK*/
 	print(){
    		console.log('Name is :'+ this.name);
 	}
};
var routes = {
	count: 0,
	routes: []
};
app.post('/createRoute', function(req, res) {
	var positions = req.body.positions;
	var startX = positions.startX;
	var startY = positions.startY;
	var startZ = positions.startZ;
	var endX = positions.endX;
	var endY = positions.endY;
	var endZ = positions.endZ;
	var startNode = {x: startX, y: startY, z: startZ};
	var route = new Route(startX, startY, startZ, endX, endY, endZ);
	route.createRoute(routes);
	//route.vertices.push({x: startX, y: 0, z: 0});
	//route.vertices.push({x: startX, y: startY, z: 0});
	//route.vertices.push({x: startX, y: startY, z: startZ});
	console.log("Vertices Below");
	route.vertices.forEach(function(vertex) {
		console.log("x: " + vertex.x + " y: " + vertex.y + " z: " + vertex.z);
	});
	res.json(route);	
	/*
	routes.route.forEach(function(route) {
		route	
	});
	*/
	
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
    res.sendFile('./route.html', {root: __dirname});
});
app.get('*', function(req, res) {
    res.sendFile('./test.html', {root: __dirname });
    //res.sendFile('./test.html');
    //res.status(200).send('ok');
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
