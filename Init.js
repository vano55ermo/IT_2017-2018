var scene, camera, renderer, earth, mars, controls;
var mouseCoords, trajectoryObjects;
var objects = [];

function init()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	camera.up = new THREE.Vector3(0, 0, 1);
	camera.position.z = 25;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	scene.add(new THREE.AxisHelper(3));

	trajectoryObjects = new THREE.Object3D();
	scene.add(trajectoryObjects);
}

// Создаёт объекты (1 раз)
function initObjects()
{
	var sunPosition = new TrajectoryStaticPosition(null, 0, 0, 0);
	var earthOrbit = new TrajectoryCircleOrbit(sunPosition, 10, 0, 0.2);
	var marsOrbit = new TrajectoryKeplerianOrbit(sunPosition, 0.8, 30, 0, 1, 0, 0, 10000, 'red');
	
	earth = new Body(1, 'white', earthOrbit, new Orientation(0,0,0,1));
	mars = new Body(0.5, 'red', marsOrbit, new Orientation(0,0,0,1));
	
	earth.addToRender(objects);
	mars.addToRender(objects);
}

// Обновляет объекты (на каждом кадре)
function updateObjects(time)
{
	for(var i = 0;i < objects.length; i++)
	{
		objects[i].update(time);
	}
}