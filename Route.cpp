//#include <array>i
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <fstream>
#include <string>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#define AIRSPACE_X 100
#define AIRSPACE_Y 100
#define AIRSPACE_Z 100
#define CLOSENESS 5
#define FAR 1000
using namespace std;
struct Route;
struct Vertex{
	//Coordinates
	int x;
	int y;
	int z;
	Vertex** neighbors;
	int numNeighbors;
	int index;//used for for determining if a vertex is valid	
	//Used for creating routes
	Vertex* prev;//previous in route
	int xCreate;//distance from endNode
	int yCreate;
	int zCreate;

	Vertex (int x, int y, int z) {
		this->x = x;
		this->y = y;
		this->z = z;
		this->index = (x / CLOSENESS) + ((y / CLOSENESS) * (AIRSPACE_X / CLOSENESS)) + ((z / CLOSENESS) * (AIRSPACE_X / CLOSENESS) * (AIRSPACE_Y / CLOSENESS));
		//cout << this->index << endl;
		this->neighbors = new Vertex*[100];
		this->numNeighbors = 0;

	}
	void p () 
	{
		printf("x:%d y:%d z:%d\n", x, y, z);
	}
	void p(int droneId)
	{
		//print("d:")
		printf("d:%d x:%d y:%d z:%d\n", droneId, x, y, z);
	}
};
struct Drone {
	double x;
	double y;
	double z;
	Vertex* current;//This is the current vertex location
	int id;
	Route* route;
	//updates the position of the drone
	void setPosition(double x, double y, double z)
	{
		this->x = x;
		this->y = y;
		this->z = z;
	}
	void setRoute(Route* route)
	{
		this->route = route;
	}
	Route* getRoute()
	{
		return route;
	}
	bool evaluatePositioningData(double x, double y, double z) 
	{
	}
	Drone(int x, int y, int z, int id) 
	{
		setPosition(x, y, z);
		this->id = id;
	}
	Drone() 
	{
		setPosition(0, 0, 0);
	}
	void p() 
	{
		//route->p();
	}
};
struct Drones {
	Drone* drones;
	int count;	
	Drones()
	{
		drones = new Drone[5];
		count = 0;
	}
	Drone* operator[](int index) {
		return getDrone(index);
	}
	void addDrone(int x, int y, int z)
	{
		drones[count] = Drone(x, y, z, count);
		count++;
	}
	Drone* getDrone(int id)
	{
		if(id >= count)
			return NULL;
		return &drones[id];
	}	
};
struct Route {
	Vertex** vertices;
	int length;
	Route(int length)
	{
		this->length = length;
		this->vertices = new Vertex*[length];
	}
	Vertex* operator[](int index)
	{
		return vertices[index];
	}
	void addVertex(Vertex* v, int i)
	{
		vertices[i] = v;
	}
	void containsVertex(Vertex* v)
	{
		for(int i = 0; i < length; i++)
		{
			Vertex* cur = vertices[i];
			//if(v->x == cur->x && v->x == cur->x && v->z == cur->z)
		}
	}
	void p()
	{
		for(int i = 0; i < length; i++)
			vertices[i]->p();
	}
	void p(int droneId)
	{
		for(int i = 0; i < length; i++)
			vertices[i]->p(droneId);
	}
	void merge(Route* route)
	{
		int newLength = this->length + route->length - 1;
		Vertex** newVertices = new Vertex*[newLength];
		for(int i = 0; i < this->length; i++)
		{
			newVertices[i] = this->vertices[i];
		}
		for(int i = 1; i < route->length; i++)
		{
			newVertices[i + this->length - 1] = route->vertices[i];	
		}
		delete this->vertices;
		this->vertices = newVertices;
		this->length = newLength;
	}
};
struct Map {
	Vertex*** routes;//all routes	
	Vertex** allVertices;//all valid vertices
	bool* validVertices;//These vertices can be used in path creation, works like a hash vertex[i] => ((x + airspace_x * y + airspace_y * airspace_x * z)/closeness)
	int totalVertices;//total number of vertices
	Drones drones;
	void addDrone(int x, int y, int z)
	{
		drones.addDrone(x, y, z);
	}
	Drone* operator[](int index) {
		return drones[index];
	}
	//update drone position
	void updateDrones(int* x, int* y, int* z, int* id, int count)
	{
		for(int i = 0; i < count; i++)
		{
			Drone* drone = drones.getDrone(id[i]);
			drone->setPosition(x[i], y[i], z[i]);
		}
	}
	//Publishes the route to ROS
	void publishRouteToROS(Route* route, int droneId)
	{
	}
	//evaluates if the positioning data from the image processing is a conflict
	bool evaluatePositioningData(double x, double y, double z, int id) {
		/*
		Drone* d = getDrone(id)
		double dx = d->x;
		double dy = d->y;
		double dz = d->z;
		double threshold = 1;
		if (pow(x - dx, 2) > threshold || pow(y - dy, 2) > threshold || pow(z - dz, 2) > threshold){
			return false;
		}
		//evaluate collision path
		Vertex* v = findVertex((int)dx, (int)dy, (int)dz);
		*/
		return true;
	}
	//update drone path
	void setRoute(Route* route, int id)
	{
		Drone* drone = drones.getDrone(id);
		drone->setRoute(route);
	}
	//creates a route from the start to end and returns an array
	Route* createRoute(Vertex* start, Vertex* end)
	{
		Vertex** vertices = initializeVertices();
		int length = totalVertices;
		Vertex* startNode = findVertex(start->x, start->y, start->z);
		Vertex* endNode = findVertex(end->x, end->y, end->z);
		endNode->xCreate = 0;
		endNode->yCreate = 0;
		endNode->zCreate = 0;
		
		while(length > 0)
		{
			Vertex* closest = vertices[0];
			int closestI = 0;
			//int i = 0;
			for(int i = 1; i < length; i++)
			{
				//printf("%d\n", i);
				if(closest == NULL)
				{
					closest = vertices[i];
					closestI = i;
					continue;
				}
				if(vertices[i] == NULL) 
				{
					continue;
				}
				int closestDistance = 
					(closest->xCreate * closest->xCreate) + 
					(closest->yCreate * closest->yCreate) + 
					(closest->zCreate * closest->zCreate);
				int curDistance = 
					(vertices[i]->xCreate * vertices[i]->xCreate) +
					(vertices[i]->yCreate * vertices[i]->yCreate) +
					(vertices[i]->zCreate * vertices[i]->zCreate);
				if(curDistance < closestDistance)
				{
					closest = vertices[i];
					closestI = i;
				}
			}
			if(closest == NULL)
				break;
			//cout << closest->x << " " << closest->y << " " << closest->z << endl;
			//found start
			//cout << closest->xCreate << " " << closest->yCreate << " " << closest->zCreate << endl;
			//if((closest->x == end->x) && (closest->y == end->y) && (closest->z == end->z))
			if((closest->x == start->x) && (closest->y == start->y) && (closest->z == start->z))
				break;
		
			for(int i = 0; i < closest->numNeighbors; i++)
			{
				Vertex* neighbor = closest->neighbors[i];
				if(validVertices[neighbor->index] == false)
				{
					//printf("%d\n", neighbor->index);
					continue;
				}
				int segmentDistX = (neighbor->x - closest->x);
				int segmentDistY = (neighbor->y - closest->y);
				int segmentDistZ = (neighbor->z - closest->z);
				int altXDiff = closest->xCreate + segmentDistX;
				int altYDiff = closest->yCreate + segmentDistY;
				int altZDiff = closest->zCreate + segmentDistZ;
				int altDist = 
					(altXDiff * altXDiff) +
					(altYDiff * altYDiff) +
					(altZDiff * altZDiff);
				int neighborDist = 
					(neighbor->xCreate * neighbor->xCreate) +
					(neighbor->yCreate * neighbor->yCreate) +
					(neighbor->zCreate * neighbor->zCreate);
				if(altDist < neighborDist)
				{
					neighbor->prev = closest;
					neighbor->xCreate = closest->xCreate + segmentDistX;
					neighbor->yCreate = closest->yCreate + segmentDistY;
					neighbor->zCreate = closest->zCreate + segmentDistZ;
				}
			}
			vertices[closestI] = vertices[--length];//remove the closest vertex
		}
		//evaluate length of route
		int routeLength = 0;
		Vertex* printNode = startNode;
		while(printNode != NULL)
		{
			routeLength++;
			printNode = printNode->prev;
		}
		//Vertex** route = new Vertex*[routeLength]
		Route* route = new Route(routeLength);
		Vertex* cur = startNode;
		int i = 0;
		while(cur != NULL)
		{
			route->addVertex(cur, i++);
			cur = cur->prev;
		}
		//route->p();
		delete vertices;

		/*only works for one drone atm*/
		addDrone(start->x, start->y, start->z);
		Drone* drone = this->drones[0];
		drone->setRoute(route);
		return route;
	}
	//find a vertice closest the the given coordinates
	Vertex* findVertex(int x, int y, int z)
	{
		Vertex* createNode = NULL;
		int differenceOriginal = -1;
		for(int i = 0; i < totalVertices; i++)
		{
			int xDiff = abs(x - allVertices[i]->x);
			int yDiff = abs(y - allVertices[i]->y);
			int zDiff = abs(z - allVertices[i]->z);
			int diff = xDiff + yDiff + zDiff;
			if(createNode == NULL)
			{
				createNode = allVertices[i];
				differenceOriginal = diff;
				continue;
			}
			if(diff < differenceOriginal)
			{
				createNode = allVertices[i];
				differenceOriginal = diff;
			}
		}
		return createNode;
	}
	//initialize all nodes in the airspace 
	Map() {
		drones = Drones();
		int size = (AIRSPACE_X / CLOSENESS + 1) * (AIRSPACE_Y / CLOSENESS + 1) * (AIRSPACE_Z / CLOSENESS + 1); 
		totalVertices = 0;
		allVertices = new Vertex*[size];
		validVertices = new bool[size];
		for(int k = 0; k < AIRSPACE_Z; k += CLOSENESS) {
			for(int j = 0; j < AIRSPACE_Y; j += CLOSENESS) {
				for(int i = 0; i < AIRSPACE_X; i += CLOSENESS) {
					validVertices[totalVertices] = true;
					allVertices[totalVertices++] = new Vertex(i, j, k);
					//cout << allVertices[totalVertices - 1]->x << endl; 
					//cout << allVertices[0]->x << endl; 
				}
			}
		}
		for(int i = 0; i < totalVertices; i++)
		{
			Vertex* cur = allVertices[i];
			for(int j = 0; j < totalVertices; j++)
			{
				if(i == j)
					continue;
				Vertex* check = allVertices[j];
				int closeToX = (cur->x + CLOSENESS >= check->x) && (cur->x - CLOSENESS <= check->x);
				int closeToY = (cur->y + CLOSENESS >= check->y) && (cur->y - CLOSENESS <= check->y);
				int closeToZ = (cur->z + CLOSENESS >= check->z) && (cur->z - CLOSENESS <= check->z);
				if(closeToX && closeToY && closeToZ)
					cur->neighbors[cur->numNeighbors++] = check;
			}
		}
	}
	//Used for creating a new route
	Vertex** initializeVertices() {
		Vertex** vertices = new Vertex*[totalVertices];
		for(int i = 0; i < totalVertices; i++)
		{
			if(!validVertices[i])
			{
				vertices[i] = NULL;
				//printf("bad");
			}
			else
			{
				vertices[i] = allVertices[i];
			//cout << totalVertices << " " << vertices[i]->x << endl;
				vertices[i]->xCreate = FAR;
				vertices[i]->yCreate = FAR;
				vertices[i]->zCreate = FAR;
				vertices[i]->prev = NULL;
			}
		}	
		return vertices;
	}
	void createObstacle(int startX, int startY, int startZ, int endX, int endY, int endZ)
	{
		int startXAdj, startYAdj, startZAdj, endXAdj, endYAdj, endZAdj;
		startXAdj = startX < endX ? startX - startX % CLOSENESS : startX + startX % CLOSENESS;
		startYAdj = startY < endY ? startY - startY % CLOSENESS : startY + startY % CLOSENESS;
		startZAdj = startZ < endZ ? startZ - startZ % CLOSENESS : startZ + startZ % CLOSENESS;
		endXAdj = endX > startX ? endX + endX % CLOSENESS : endX - endX % CLOSENESS;
		endYAdj = endY > startY ? endY + endY % CLOSENESS : endY - endY % CLOSENESS;
		endZAdj = endZ > startZ ? endZ + endZ % CLOSENESS : endZ - endZ % CLOSENESS;
		int smallestX, smallestY, smallestZ, largestX, largestY, largestZ;
		if(startXAdj < endXAdj)
		{
			smallestX = startXAdj;
			largestX = endXAdj;
		}
		else
		{
			smallestX = endXAdj;
			largestX = startXAdj;
		}
		if(startYAdj < endYAdj)
		{
			smallestY = startYAdj;
			largestY = endYAdj;
		}
		else
		{
			smallestY = endYAdj;
			largestY = startYAdj;
		}
		if(startZAdj < endZAdj)
		{
			smallestZ = startZAdj;
			largestZ = endZAdj;
		}
		else
		{
			smallestZ = endZAdj;
			largestZ = startZAdj;
		}
		for(int k = smallestZ; k <= largestZ; k += CLOSENESS)
		{
			for(int j = smallestZ; j <= largestZ; j += CLOSENESS)
			{
				for(int i = smallestZ; i <= largestZ; i += CLOSENESS)
				{
					int index = ((i / CLOSENESS) + (j / CLOSENESS) * (AIRSPACE_X / CLOSENESS) + (k / CLOSENESS) * (AIRSPACE_X / CLOSENESS) * (AIRSPACE_Y / CLOSENESS)); 
					validVertices[index] = false;
				}
			}
		}
	}	
	//evaluate if a vertex is safe
	static int evaluateSafeness(Vertex* v)
	{
		return 0;
	}
	void destroyVertices() {
		for(int i = 0; i < totalVertices; i++)
			delete allVertices[i];
		delete allVertices;
	}
};
void getToken(char** token, int* val);

int main() {
	/*
	string serverIdString;
	cin >> serverIdString;
	//int serverPID = atoi(serverIdString.c_str());
	string connectToServerText = "echo \"Hello World PID: \n" + serverIdString + "\" > /proc/" + serverIdString + "/fd/1";
	int status = system(connectToServerText.c_str());
	*/
	pid_t pid = getpid();	
	ofstream myfile;
  	myfile.open("routePid.txt");
  	myfile << (int)pid;
  	myfile.close();
	
	Map routes = Map();
	/*
	Vertex v1 = Vertex(0, 0, 0);
	Vertex v2 = Vertex(0, 0, 10);
	Vertex v3 = Vertex(10, 0, 10);
	Vertex v4 = Vertex(10, 10, 10);
	Vertex v5 = Vertex(0, 10, 10);
	Vertex v6 = Vertex(0, 0, 10);
	Vertex v7 = Vertex(0, 0, 0);
	string coordinates;
	
	//cin >> coordinates;
	//routes->createObstacle(5,5,5,10,10,10);
	//routes->createObstacle(25,25,25,30,30,30);
	Route* route1 = routes.createRoute(&v1, &v2);	
	Route* route2 = routes.createRoute(&v2, &v3);	
	Route* route3 = routes.createRoute(&v3, &v4);	
	Route* route4 = routes.createRoute(&v4, &v5);	
	Route* route5 = routes.createRoute(&v5, &v6);	
	Route* route6 = routes.createRoute(&v6, &v7);	
	route1->merge(route2);
	route1->merge(route3);
	route1->merge(route4);
	route1->merge(route5);
	route1->merge(route6);
	route1->p(0);
	//Drone drone();
	//drone.setRoute(route1);
	//drone.p();
	*/
	
	int id = 0;
	/*
	routes.addDrone(0, 0, 0);
	routes.setRoute(route1, 0);
	*/
	//route1->p();
	
	string command = "";
	while(command.compare("end"))
	{
		//string numberOfCommands;
		//cin >> numberOfCommands;
		//int argsCount = atoi(myString.c_str());
		//string command;
		cin >> command;
		/*
		ifstream serverfile;
  		serverfile.open("route.txt");
  		serverfile >> command;
  		serverfile.close();
		cout << "cmd: " << command.c_str() << "end\n";
		*/
		/*	
		char arr[20];
		const char* commandChar = command.c_str();
		cout << "token: " << command << endl;
		for(int i = 0; i < strlen(commandChar) + 1; i++)
		{
			arr[i] = commandChar[i];
		}
		cout << "arr: " << arr << endl;
		*/
		/*
		char* token = arr;
		int tokenI = 0;
		while(token[tokenI] != 0 && token[tokenI] != ' ')
			tokenI++;
		token[tokenI] = 0;
		token += tokenI + 1;
		cout << tokenI;
		*/		
		
		if(strcmp(command.c_str(), "new") == 0)//new 0 0 0 5 5 5
		{
			int startX, startY, startZ, endX, endY, endZ;
			/*
			cout << "m";	
			getToken(&token, &startX);
			cout << "m";	
			*/
			cin >> command;
			startX = atoi(command.c_str());
			cin >> command;
			startY = atoi(command.c_str());
			cin >> command;
			startZ = atoi(command.c_str());
			cin >> command;
			endX = atoi(command.c_str());
			cin >> command;
			endY = atoi(command.c_str());
			cin >> command;
			endZ = atoi(command.c_str());
			/*
			getToken(&token, &startY);
			getToken(&token, &startZ);
			getToken(&token, &endX);
			getToken(&token, &endY);
			getToken(&token, &endZ);
			*/
			Vertex a = Vertex(startX, startY, startZ);
			Vertex b = Vertex(endX, endY, endZ);
			Route* newRoute = routes.createRoute(&a, &b);	
			newRoute->p(0);//transmit to node server
		}
		else if(strcmp(command.c_str(), "get") == 0)//get
		{
			string pid_str;
			ifstream serverfile;
  			serverfile.open("routePid.txt");
  			serverfile >> pid_str;
  			serverfile.close();
			Route* route = routes[0]->getRoute();
			string size = to_string(route->length) + '\n';
			string pidCmd = "/proc/" + pid_str + "/fd/0";
			string lengthCmd = "printf \"" + size + "\n\" > " + pidCmd;
			system(lengthCmd.c_str());
			for(int i = 0; i < route->length; i++) {
				Vertex* v = (*route)[i];
				string cmd = "echo \"" + to_string(v->x) +  " " + to_string(v->y) + " " + to_string(v->z) + "\" > " + pidCmd;
				system(cmd.c_str());
			}
		}
		cin.clear();
		
		//break;
	
	}
	cin >> command;
	return 0;
}

void getToken(char** token, int* val)
{
			char* t = *token;
			unsigned int tokenI = (unsigned int)(strchr(t, ' ') - t);
			t[tokenI] = 0;
			(*val) = atoi(t);
			(*token) = t + tokenI + 1;
}
