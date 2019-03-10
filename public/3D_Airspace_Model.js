/* 3D AIRSPACE MODEL */

/*
 *
 */

/* SCENE|CANVAS|RENDERER SETUP */
var scene = new THREE.Scene();
var canvas = document.getElementById("target_window");
var renderer = new THREE.WebGLRenderer( {canvas:canvas} );
renderer.setClearColor( 0x99ccff, 0);
renderer.setSize(window.screen.width * 2 / 3, window.screen.height * 4 / 5);
document.body.appendChild( renderer.domElement );

/* CAMERA SETUP */
var camera = new THREE.PerspectiveCamera( 45, window.screen.width / window.screen.height, 1, 2000);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );
var scene = new THREE.Scene();

/* RENDERING */
renderer.render(scene, camera);

/* GRAPH (DEV BUILD CONTENT) */
var x_mat = new THREE.LineBasicMaterial( { color: 0x0000ff, linewidth: 5 } );	// blue
var y_mat = new THREE.LineBasicMaterial( { color: 0x00ff00, linewidth: 5 } );	// green
var z_mat = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 5 } );	// red
var x_geo = new THREE.Geometry();
x_geo.vertices.push(new THREE.Vector3(-1000, 0, 0));
x_geo.vertices.push(new THREE.Vector3(1000, 0, 0));
var y_geo = new THREE.Geometry();
y_geo.vertices.push(new THREE.Vector3(0, -1000, 0));
y_geo.vertices.push(new THREE.Vector3(0, 1000, 0));
var z_geo = new THREE.Geometry();
z_geo.vertices.push(new THREE.Vector3(0, 0, -1000));
z_geo.vertices.push(new THREE.Vector3(0, 0, 1000));
var x_line = new THREE.Line(x_geo, x_mat);
var y_line = new THREE.Line(y_geo, y_mat);
var z_line = new THREE.Line(z_geo, z_mat);
scene.add(x_line, y_line, z_line);

/* LIGHT */
scene.add( new THREE.AmbientLight( 0x666666 ) );
var light = new THREE.DirectionalLight( 0xdfebff, 1 );
light.position.set( 50, 200, 100 );
light.position.multiplyScalar( 1.3 );
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
var d = 300;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.camera.far = 1000;
scene.add( light );

/* BOX BASE VARIABLES */
var width;
var height;
var depth;
var box;
var box_mesh
var box_normal_vectors = [];

/* BOX MESH MATERIALS */
var box_mat_default = new THREE.MeshLambertMaterial( {
	transparent: true,
	opactiy: 1,
	color: 0x00ff00,
	alphaTest: 0.5,
	side: THREE.DoubleSide
} );
var multi_mat = [box_mat_default.clone(), box_mat_default.clone(), box_mat_default.clone(),
					box_mat_default.clone(), box_mat_default.clone(), box_mat_default.clone()];

/* BOX */
var create_box = function(){
	/* CLEARING */
	if(scene.getObjectByName("box_mesh")){
		var sel_obj = scene.getObjectByName("box_mesh");
		scene.remove(sel_obj);
		var sel_edge = scene.getObjectByName("box_edges");
		scene.remove(sel_edge);
	}
	box_normal_vectors = [];
	/* DIMENSIONS */
	width = document.getElementById("air_space_w").value;
	height = document.getElementById("air_space_h").value;
	depth = document.getElementById("air_space_d").value;
	
	/* BOX */
	box = new THREE.BoxGeometry( width, height, depth );
	
	for( var cnt = 0; cnt < box.faces.length; cnt++ ){
		//box.faces[cnt].materialIndex = 0;
		box_normal_vectors.push(box.faces[cnt].normal);
		println("Face " + cnt);
		println("Material Index = " + box.faces[cnt].materialIndex)
		println("Normals: x = " + box.faces[cnt].normal.x + " | y = " + box.faces[cnt].normal.y + " | z = " + box.faces[cnt].normal.z);
	}
	printEmpty();
	box_mesh = new THREE.Mesh(box, multi_mat);
	box_mesh.position.set(width/2, height/2, depth/2);
	box_mesh.name = "box_mesh";
	scene.add(box_mesh);
	
	/* EDGES */
	var box_edges = new THREE.EdgesGeometry( box );
	var box_line = new THREE.LineSegments( box_edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
	box_line.position.set(width/2, height/2, depth/2);
	box_line.name = "box_edges";
	scene.add(box_line);
	
	/* DEBUGGING */
	println("Airspace set");
	println("height = " + height + " | width = " + width + " | depth = " + depth);
	printEmpty();
}

/* TRANSPARENCY BASE VARIABLES */
var cam_vector = camera.position.clone();

/* TRANSPARENCY */
var transparency = function () {
	camera.updateMatrixWorld();
	cam_vector = camera.position.clone();
	println("Camera vector:");
	println("x: " + cam_vector.x);
	println("y: " + cam_vector.y);
	println("z: " + cam_vector.z);
	printEmpty();
	
	/*
	var view_vector = camera.getWorldDirection(new THREE.Vector3(0, 0 , 0));
	println("Camera View vector:");
	println("x: " + view_vector.x);
	println("y: " + view_vector.y);
	println("z: " + view_vector.z);
	printEmpty();
	*/
	
	if(scene.getObjectByName("box_mesh")){
		for( var cnt = 0; cnt <  box_normal_vectors.length; cnt++ ){
			if(!camera_relative_visible(Math.floor(cnt/2))){
				box_mesh.material[Math.floor(cnt/2)].opacity = 1;
				cnt++;
				box_mesh.material[Math.floor(cnt/2)].opacity = 1;
				box_mesh.needsUpdate = true;
				//continue;
			}
			else{
				box_mesh.material[Math.floor(cnt/2)].opacity = 0;
				cnt++;
				box_mesh.material[Math.floor(cnt/2)].opacity = 0;
				box_mesh.needsUpdate = true;
			}
			
			/* GARBAGE CODE FOR PROOF OF MY IDIOCY */
			/*
			println(box_normal_vectors[cnt].x + " * " + view_vector.x + " + " + box_normal_vectors[cnt].y + " * " + view_vector.y + " + " + box_normal_vectors[cnt].z + " * " + view_vector.z);
			var dot_product = box_normal_vectors[cnt].x * view_vector.x + box_normal_vectors[cnt].y * view_vector.y + box_normal_vectors[cnt].z * view_vector.z;
			println("Dot Product = " + dot_product);
			if(dot_product < 0){
				println(Math.floor(cnt/2));
				box_mesh.material[Math.floor(cnt/2)].opacity = 0;
				box_mesh.needsUpdate = true;
			}
			else{
				println(Math.floor(cnt/2));
				box_mesh.material[Math.floor(cnt/2)].opacity = 1;
				box_mesh.needsUpdate = true;
			}
			printEmpty();
			*/
		}
	}
	
}

/* CONTROLS */
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI;
controls.minDistance = 25;
controls.maxDistance = 1000;
controls.addEventListener( 'change', transparency );

/* This function checks whether the camera's position relative
 *	to the faces allow the respective face to even be seen.
 *
 *	I.E. if the camera is centered on one face of the square,
 *	then none of the other faces can be seen, regardless of
 *	the dot product.
 */
var camera_relative_visible = function (plane) {
	switch(plane){
		case 0:
			if(cam_vector.x < width){
				return false;
			}
			else{
				return true;
			}
			break;
		case 1:
			if(cam_vector.x > 0){
				return false;
			}
			else{
				return true;
			}
			break;
		case 2:
			if(cam_vector.y < height){
				return false;
			}
			else{
				return true;
			}
			break;
		case 3:
			if(cam_vector.y > 0){
				return false;
			}
			else{
				return true;
			}
			break;
		case 4:
			if(cam_vector.z < depth){
				return false;
			}
			else{
				return true;
			}
			break;
		case 5:
			if(cam_vector.z > 0){
				return false;
			}
			else{
				return true;
			}
			break;
		default:
			// ERROR
			break;
	}
}

var reset_system = function(){
	if(scene.getObjectByName("box_mesh")){
		var sel_obj = scene.getObjectByName("box_mesh");
		scene.remove(sel_obj);
		var sel_edge = scene.getObjectByName("box_edges");
		scene.remove(sel_edge);
	}
}

var animate = function () {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

animate();
