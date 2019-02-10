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
		this.neighbors = [];
		this.dist = {x: 10000, y: 10000, z: 10000};
		this.prev = null;
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
	static initializeVertices()
	{
		Route.createVertices = [];
		Route.allVertices.vertices.forEach(function (vertex) {
			vertex.dist = {x: 100000, y: 10000, z: 10000};
			vertex.prev = null;
			vertex.visited = false;
			Route.createVertices.push(vertex);
		});

	}
	static findVertex(x, y, z)
	{
		var createNode = null;
		var differenceOriginal = -1;
		var zClosest = null;
		/*
		Route.levels.forEach(function(level) {
			var zDifference = Math.abs(parseInt(level.level) - parseInt(z));
			if(zClosest == null)
			{
				zClosest = level;
				return;
			}
			if(parseInt(zClosest.level) > parseInt(level.level))
			{
				zClosest = level;
			}
			//console.log(parseInt(zDifference));
		});
		*/
		Route.allVertices.vertices.forEach(function(vertex) {
			//if(zClosest != null && (parseInt(vertex.z) == parseInt(zClosest.level)))
			//{
				var xDifference = Math.abs(x - parseInt(vertex.x));
				var yDifference = Math.abs(y - parseInt(vertex.y));
				var zDifference = Math.abs(z - parseInt(vertex.z));
				
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
			//}
		});
		//console.log(createNode);
		return createNode;
	}
	static initialize() { 
		/*creating route vertices*/
		for(var k = 0; k < parseInt(Route.airSpace.z); k += Route.closeness * Route.zScale)
		{
			Route.levels.push({level: k, traffic: 0});
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
						curVertex.neighbors.push(checkVertex);
					}

				}
			}
			console.log(Route.allVertices.vertices[0]);// + " "  + Route.allVertices.vertices[0].neighbors);
		}
	}
	/*Createsa route*/
	createRoute(routes) {	
		Route.initializeVertices();	
		this.createDirection = -1;//used to create routes
		var differenceOriginal = -1;
		var startX = parseInt(this.startLocation.x);
		var startY = parseInt(this.startLocation.y);
		var startZ = parseInt(this.startLocation.z);
		var startNode = Route.findVertex(startX, startY, startZ);
		this.vertices.push(startNode);
		/*Evaluate flight height*/
		var minLevel;	
		var endX = parseInt(this.endLocation.x);
		var endY = parseInt(this.endLocation.y);
		var endZ = parseInt(this.endLocation.z);
		var endNode = Route.findVertex(endX, endY, endZ);
		endNode.visited = true;
		endNode.dist = {x: 0, y: 0, z: 0};
		console.log(endNode);
		var numLevels = Math.abs(parseInt(startNode.z) - parseInt(endNode.z));
		while(Route.createVertices.length > 0)
		{
			//find closest
			var closest = {
				vertex: Route.createVertices[0],
				index: 0
			};
			
			for(var i = 0; i < Route.createVertices.length; i++)
			{
				var closestDistance = 
					(parseInt(closest.vertex.dist.x) * parseInt(closest.vertex.dist.x)) + 
					(parseInt(closest.vertex.dist.y) * parseInt(closest.vertex.dist.y)) + 
					(parseInt(closest.vertex.dist.z) * parseInt(closest.vertex.dist.z));
				var curDistance = 
					(parseInt(Route.createVertices[i].dist.x) * parseInt(Route.createVertices[i].dist.x)) + 
					(parseInt(Route.createVertices[i].dist.y) * parseInt(Route.createVertices[i].dist.y)) + 
					(parseInt(Route.createVertices[i].dist.z) * parseInt(Route.createVertices[i].dist.z)); 
				//console.log(Route.createVertices[i]);
				if(curDistance < closestDistance)
				{
					closest.vertex = Route.createVertices[i];
					closest.index = i;
				}
			}
			//console.log(closest.vertex.neighbors);
			
			Route.createVertices.splice(parseInt(closest.index), 1);//remove element from array
			closest.vertex.neighbors.forEach(function(neighbor){
				var segment = {
					x: Math.abs(parseInt(neighbor.x) - parseInt(closest.vertex.x)), 
					y: Math.abs(parseInt(neighbor.y) - parseInt(closest.vertex.y)), 
					z: Math.abs(parseInt(neighbor.z) - parseInt(closest.vertex.z))
				};
				//console.log(segment);
				//find alternate distance from endNode
				var altDist = 
					((parseInt(closest.vertex.dist.x) + parseInt(segment.x)) * (parseInt(closest.vertex.dist.x) + parseInt(segment.x))) +
					((parseInt(closest.vertex.dist.y) + parseInt(segment.y)) * (parseInt(closest.vertex.dist.y) + parseInt(segment.y))) +
					((parseInt(closest.vertex.dist.z) + parseInt(segment.z)) * (parseInt(closest.vertex.dist.z) + parseInt(segment.z)));
				//find current distance from endNode
				var neighborDist =
					(parseInt(neighbor.dist.x) * parseInt(neighbor.dist.x)) +
					(parseInt(neighbor.dist.y) * parseInt(neighbor.dist.y)) +
					(parseInt(neighbor.dist.z) * parseInt(neighbor.dist.z));
				//console.log(altDist + " " + neighborDist);
				if(altDist < neighborDist)
				{
					neighbor.prev = closest.vertex
					neighbor.dist.x = parseInt(closest.vertex.dist.x) + parseInt(segment.x);
					neighbor.dist.y = parseInt(closest.vertex.dist.y) + parseInt(segment.y);
					neighbor.dist.z = parseInt(closest.vertex.dist.z) + parseInt(segment.z);
				}
			});
			//console.log(closest.vertex.neighbors);
			//break;
		}
		var printNode = startNode;
		while(printNode != null)
		{
			console.log(printNode);
			this.vertices.push(printNode);
			//routes.routes.push(printNode);
			printNode = printNode.prev;
		}
		/*
		if(parseInt(createNode.z) > parseInt(endNode.z))
		{
			minLevel = parseInt(endNode.z);
		}
		else
		{
			minLevel = parseInt(createNode.z);
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
		this.iterateRoute(createNode, routes);
		*/
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
		}
	}
	/*JUNK*/
 	/*
	print(){
    		console.log('Name is :'+ this.name);
 	}*/
};
Route.allVertices = { vertices: [] };
Route.createVertices = [];
Route.levels = [];
Route.airSpace = {x : 20, y: 20, z: 10};
Route.closeness = 5;
Route.zScale = 1;
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
