/* The selected module: 1-3 are the drones
 *	0 is environment. Default will be 1.
 */
var selection = 1

var current_pos = [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)];
var on_track = [1, 1, 1];

var drone_selection = function(input){
	switch(input){
		case 0:
			break;
		case 1:
			document.getElementById("selection_title").innerHTML = "Drone 1";
			selection = 1;
			break;
		case 2:
			document.getElementById("selection_title").innerHTML = "Drone 2";
			selection = 2;
			break;
		case 3:
			document.getElementById("selection_title").innerHTML = "Drone 3";
			selection = 3;
			break;
		default:
			break;
	}
	
}

var environment_selection = function(){
	document.getElementById("selection_title").innerHTML = "Environment";
	selection = 4;
}

var send_coor = function(){
	var something = 0;
}
