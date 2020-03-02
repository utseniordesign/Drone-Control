/* BUTTON FUNCTIONS */

/* General button functionalities
 *	that are not tied to any
 *	specific modules within the
 *	application. I.E. camera view
 *	buttons, air space camera view
 *	buttons, etc.
 */

var displayXY = function () {
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 100;
	//camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(0, 5, 0);
	updateRotation();
}
var displayXZ = function () {
	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 0;
	//camera.up = new THREE.Vector3(0,0,1);

	camera.lookAt(new THREE.Vector3(0, 0, 0));
	updateRotation();
	//alert("X: " + camera.rotation.x + " Y:" + camera.rotation.y + " Z: " + camera.rotation.z);
}	
var displayYZ = function () {
	camera.position.x = 100;
	camera.position.y = 0;
	camera.position.z = 0;
	//camera.up = new THREE.Vector3(1,0,0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	updateRotation();
	//alert("X: " + camera.rotation.x + " Y:" + camera.rotation.y + " Z: " + camera.rotation.z);
}
var displayThreeDim = function () {
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 100;
	//camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	updateRotation();
	//alert("X: " + camera.rotation.x + " Y:" + camera.rotation.y + " Z: " + camera.rotation.z);
}