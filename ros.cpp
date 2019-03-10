#include <string>
#include <iostream>

using namespace std;
int main() {
	string val;
	int i = 0;
	while(i++ < 13)
	{
		cin >> val;
		cout << val + ' ';
		cin >> val;
		cout << val + ' ';
		cin >> val;
		cout << val + '\n';
	}
}
