var express = require('express'); 
//var mysql = require('mysql');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
/*
var con = mysql.createConnection({
  host: 'localhost',
  user: 'michael',
  password: 'ziggythedog',
  database: 'test'
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/
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
 	}
	static findVertex(x, y, z)
	{
		var createNode = null;
		var differenceOriginal = -1;
		var 
		Route.allVertices.vertices.forEach(function(vertex) {

			var xDifference = Math.abs(startX - parseInt(vertex.x));
			var yDifference = Math.abs(startY - parseInt(vertex.y));
			var zDifference = Math.abs(startZ - parseInt(vertex.z));
			var difference = xDifference + yDifference + zDifference;
			if(createNode == null)
			{
				//console.log(vertex.x + " " + vertex.y + " " + vertex.z);
				createNode = vertex;
				differenceOriginal = difference;
				return;
			}
			if(difference < differenceOriginal)
			{
				//console.log(vertex.x + " " + vertex.y + " " + vertex.z);
				createNode = vertex;
				differenceOriginal = difference;
			}
		});
		return createNode;
	}
	static initialize() { 
		/*creating route vertices*/
		for(var k = 0; k < parseInt(Route.airSpace.z); k += Route.closeness * Route.zScale)
		{
			Route.levels.push({level: k / (Route.closeness * Route.zScale), traffic: 0});
			for(var j = 0; j < parseInt(Route.airSpace.y); j += Route.closeness)
			{
				for(var i = 0; i < parseInt(Route.airSpace.x); i += Route.closeness)
				{
					Route.allVertices.vertices.push(new Vertex(i, j, k));
				}
			}
		}
		/*creating route segments*/
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
					var closeToX = (curX + Route.closeness >= checkX) && (curX - Route.closeness <= checkX);
					var closeToY = (curY + Route.closeness >= checkY) && (curY - Route.closeness <= checkY);
					var closeToZ = (curZ + Route.closeness >= checkZ) && (curZ - Route.closeness <= checkZ);
					if(closeToX && closeToY && closeToZ)
					{
						var contains = null;
						checkVertex.segments.forEach(function (segment){
						//console.log("close enough");
							if(segment.vertexA == curVertex)
								contains = segment;
							if(segment.vertexB == curVertex)
								contains = segment;
						});
						if(contains == null)
						{
							curVertex.segments.push(new Segment(curVertex, checkVertex));
						}
						else
						{
							curVertex.segments.push(contains);
						}
					}

					/*
					for(var k = 0; k < checkVertex.segments.length; k++)
					{
						if(checkVertex.segments[k].vertexA.x == )
					}*/
				}
			}
			//console.log("finished initializing");
		}
		/*
		Route.allVertices.vertices.forEach(function(vertex) {
		

		});
		*/
	}
	/*Createsa route*/
	createRoute(routes) {
		
		this.createDirection = -1;//used to create routes
		var createNode = Route.findVertex(startX, startY, startZ);
		var differenceOriginal = -1;
		var startX = parseInt(this.startLocation.x);
		var startY = parseInt(this.startLocation.y);
		var startZ = parseInt(this.startLocation.z);
		this.vertices.push(createNode);
		this.iterateRoute(createNode, routes);
		routes.routes.push(this);
	}
	evaluateSafeness(routes, modified) {
		var safeDirections = {x: true, y: true, z: true};	
		var closeness = Route.closeness;
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
		//console.log("Node: " + node.x + " " + node.y + " " + node.z);
		//console.log(node.segments);
		var xDifference = 0;
		var yDifference = 0;
		var zDifference = 0;
		if(parseInt(this.endLocation.x) - parseInt(node.x) > 0)
		{
			xDifference = 1;
		}
		else if(parseInt(this.endLocation.x) - parseInt(node.x) < 0)
		{
			xDifference = -1;
		}
		if(parseInt(this.endLocation.y) - parseInt(node.y) > 0)
		{
			yDifference = 1;
		}
		else if(parseInt(this.endLocation.y) - parseInt(node.y) < 0)
		{
			yDifference = -1;
		}
		if(parseInt(this.endLocation.z) - parseInt(node.z) > 0)
		{
			zDifference = 1;
		}
		else if(parseInt(this.endLocation.z) - parseInt(node.z) < 0)
		{
			zDifference = -1;
		}
		if(zDifference != 0)//Evaluate if the z-level needs to be changed
		{
			var minLevel;
			var startZ = parseInt(this.startLocation.z);
			var endZ = parseInt(this.endLocation.z);
			var numLevels = Math.abs(parseInt(this.endLocation.z) - parseInt(this.startLocation.z));
			if(startZ > endZ)
			{
				minLevel = endZ;
			}
			else
			{
				minLevel = startZ;
			}
			var leastTraffic = minLevel;
			for(var i = minLevel + 1; i < minLevel + numLevels; i++)
			{
				if(parseInt(Route.levels[i].traffic) < parseInt(Route.levels[leastTraffic].traffic))
				{
					leastTraffic = i;
				}
			}
			var zNew = leastTraffic * Route.closeness * Route.zScale;


		}
		for(var i = 0; i < node.segments.length; i++) {
			var nodeNext;
			var segment = node.segments[i];
			if(segment.vertexA == node)
			{
				nodeNext = segment.vertexB;
			}
			else
			{
				nodeNext = segment.vertexA;
			}
			//console.log(nodeNext);
			var safeToAddX = (xDifference == 1 && parseInt(nodeNext.x) > parseInt(node.x)) 
				|| (xDifference == -1 && parseInt(nodeNext.x) < parseInt(node.x)) 
				|| (xDifference == 0 && parseInt(nodeNext.x) == parseInt(node.x));
			var safeToAddY = (yDifference == 1 && parseInt(nodeNext.y) > parseInt(node.y)) 
				|| (yDifference == -1 && parseInt(nodeNext.y) < parseInt(node.y))
				|| (yDifference == 0 && parseInt(nodeNext.y) == parseInt(node.y));
			var safeToAddZ = (zDifference == 1 && parseInt(nodeNext.z) > parseInt(node.z)) 
				|| (zDifference == -1 && parseInt(nodeNext.z) < parseInt(node.z)) 
				|| (zDifference == 0 && parseInt(nodeNext.z) == parseInt(node.z));
			//console.log(safeToAddX + " " + safeToAddY + " " + safeToAddZ);
			if(safeToAddX && safeToAddY && safeToAddZ)
			{
				this.vertices.push(nodeNext);
				this.iterateRoute(nodeNext, routes);
				return;
			}
			/*
			if(this.createDirection == X)
			{
				if(safeToAddX && safeToAddY && safeToAddZ)
				{
					this.vertices.push(nodeNext);
					this.iterateRoute(nodeNext, routes);
					return;
				}
				
			}
			if(this.createDirection == Y)
			{
				if(safeToAddY)
				{
					this.vertices.push(nodeNext, routes);
					this.iterateRoute(nodeNext, routes);
					return;
				}
			}
			if(this.createDirection == Z)
			{
				if(safeToAddZ)
				{
					this.vertices.push(nodeNext, routes);
					this.iterateRoute(nodeNext, routes);
					return;
				}
			}
			//console.log("Y change: " + safeDirections.x + " " + safeDirections.y + " " + safeDirections.z);

			if(safeToAddX)
			{
				this.createDirection = X;
				this.vertices.push(nodeNext);
				this.iterateRoute(nodeNext, routes);
				return;
			}
			if(safeToAddY)
			{
				this.createDirection = Y;
				this.vertices.push(nodeNext);
				this.iterateRoute(nodeNext, routes);
				return;
			}
			if(safeToAddZ)
			{
				this.createDirection = Z;
				this.vertices.push(nodeNext);
				this.iterateRoute(nodeNext, routes);
				return;
			}*/	
		}
	}
	/*JUNK*/
 	/*
	print(){
    		console.log('Name is :'+ this.name);
 	}*/
};
Route.allVertices = { vertices: [] };
Route.levels = [];
Route.airSpace = {x : 100, y: 100, z: 100};
Route.closeness = 5;
Route.zScale = 2;
Route.initialize();
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
	console.log("Vertices Below");
	var resultRoute = { vertices: [] };
	route.vertices.forEach(function(vertex) {
		console.log("x: " + vertex.x + " y: " + vertex.y + " z: " + vertex.z);
		resultRoute.vertices.push({x: vertex.x, y: vertex.y, z: vertex.z});
	});
	res.json(resultRoute);		
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
});
app.get('/droneRoute', function(req, res) {
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
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
