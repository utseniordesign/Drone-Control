//#include <array>i
#include <cstdlib>
#include <iostream>
#define AIRSPACE_X 100
#define AIRSPACE_Y 100
#define AIRSPACE_Z 100
#define CLOSENESS 5
#define FAR 1000
using namespace std;
struct Vertex{
	//Coordinates
	int x;
	int y;
	int z;
	Vertex** neighbors;
	int numNeighbors;
	
	//Used for creating routes
	Vertex* prev;//previous in route
	int xCreate;//distance from endNode
	int yCreate;
	int zCreate;

	Vertex (int x, int y, int z) {
		this->x = x;
		this->y = y;
		this->z = z;
		this->neighbors = new Vertex*[100];
		this->numNeighbors = 0;

	}
};

struct Route {
	Vertex*** routes;//all routes	
	Vertex** allVertices;//all valid vertices
	int totalVertices;//total number of vertices
	//create a route from the start to end node
	Vertex* createRoute(Vertex* start, Vertex* end)
	{
		Vertex** vertices = initializeVertices();
		int length = totalVertices;
		Vertex* startNode = findVertex(start->x, start->y, start->z);
		Vertex* endNode = findVertex(end->x, end->y, end->z);
		//cout << startNode->x << endl;
		endNode->xCreate = 0;
		endNode->yCreate = 0;
		endNode->zCreate = 0;
		
		while(length > 0)
		{
			Vertex* closest = vertices[0];
			int closestI = 0;
			for(int i = 0; i < length; i++)
			{
				if(endNode == vertices[i])
				{
			//		cout << "endNode" << endl;
			//		cout << endNode->xCreate << " " << endNode->yCreate << " " << endNode->zCreate << endl;
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
			//cout << closest->x << " " << closest->y << " " << closest->z << endl;
			//found start
			//cout << closest->xCreate << " " << closest->yCreate << " " << closest->zCreate << endl;
			//if((closest->x == end->x) && (closest->y == end->y) && (closest->z == end->z))
			if((closest->x == start->x) && (closest->y == start->y) && (closest->z == start->z))
				break;
			
			for(int i = 0; i < closest->numNeighbors; i++)
			{
				Vertex* neighbor = closest->neighbors[i];
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
			//length--;
			//			delete closest;
		}
		Vertex* printNode = startNode;
		while(printNode != NULL)
		{
			//cout << printNode->x << " " << printNode->y << " " << printNode->z << endl;
			printNode = printNode->prev;
		}
		/*
		for(int i = 0; i < endNode->numNeighbors; i++)
			cout << endNode->neighbors[i]->x << " " << endNode->neighbors[i]->y << " " << endNode->neighbors[i]->z << endl;
		*/
		//delete [] vertices;
		return NULL;
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
	void initialize() {
		int size = (AIRSPACE_X / CLOSENESS + 1) * (AIRSPACE_Y / CLOSENESS + 1) * (AIRSPACE_Z / CLOSENESS + 1); 
		totalVertices = 0;
		allVertices = new Vertex*[size];
		for(int k = 0; k < AIRSPACE_Z; k += CLOSENESS) {
			for(int j = 0; j < AIRSPACE_Y; j += CLOSENESS) {
				for(int i = 0; i < AIRSPACE_X; i += CLOSENESS) {
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
			vertices[i] = allVertices[i];
			//cout << totalVertices << " " << vertices[i]->x << endl;
			
			vertices[i]->xCreate = FAR;
			vertices[i]->yCreate = FAR;
			vertices[i]->zCreate = FAR;
			vertices[i]->prev = NULL;
		}	
		return vertices;
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

int main() {
	Route* routes = new Route();
	routes->initialize();
	Vertex v = Vertex(0, 0, 0);
	Vertex v2 = Vertex(100, 100, 100);
	routes->createRoute(&v, &v2);	
	return 0;
}
