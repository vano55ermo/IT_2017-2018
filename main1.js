var scene, camera, renderer, earth, mars, controls;

class Body
{
	constructor(size, color, trajectory) {
		var geometry = new THREE.SphereGeometry(size, 8, 6);
var material = new THREE.MeshBasicMaterial({color: color});

this.threeObj = new THREE.Mesh(geometry, material);
scene.add(this.threeObj);

this.trajectory = trajectory;
}

update(time) {
	var pos = this.trajectory.getPosition(time);

	this.threeObj.position.set(pos.x, pos.y, pos.z);
}
}

// Родительский класс (абстрактный)
class TrajectoryAbstract
{
	constructor(parentTrajectory)
	{
		this.parentTrajectory = parentTrajectory;
}

getPosition(time) {}
}

// Дочерний класс (наследник TrajectoryAbstract)
class TrajectoryStaticPosition extends TrajectoryAbstract
{
	constructor(parentTrajectory, x, y, z)
{
	// Вызов родительского конструктора
// Метод constructor класса Trajectory
		super(parentTrajectory);

		// Создание свойств, характерных
// для класса StaticPosition
this.x = x;
this.y = y;
this.z = z;
}

getPosition(time)
{
	var parentPosition = {x: 0, y: 0, z: 0};

	if (this.parentTrajectory)
{
		parentPosition = this.parentTrajectory.getPosition(time);
}

	return {
x: parentPosition.x + this.x,
y: parentPosition.y + this.y,
z: parentPosition.z + this.z
};
}
}

class TrajectoryCircleOrbit extends TrajectoryAbstract
{
	constructor(parentTrajectory, radius, startingAngle, angularVelocity)
	{
		super(parentTrajectory);

		this.r = radius;
		this.startingAngle = startingAngle;
		this.angularVelocity = angularVelocity;
	}

getPosition(time)
{
	var angle = this.startingAngle + this.angularVelocity * time;
	var parentPosition = this.parentTrajectory.getPosition(time);

	return {
		x: parentPosition.x + this.r * Math.cos(angle),
		y: parentPosition.y + this.r * Math.sin(angle),
		z: 0
			};
}
}

// Инициализирует сцену (1 раз)
function init() {
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.up = new THREE.Vector3(0, 0, 1);
camera.position.z = 25;


renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AxisHelper(3));
}

// Создаёт объекты (1 раз)
function initObjects() {
	var sunPosition = new TrajectoryStaticPosition(null, 0, 0, 0);
	var earthOrbit = new TrajectoryCircleOrbit(sunPosition, 10, 0, 0.2);
	var marsOrbit = new TrajectoryCircleOrbit(sunPosition, 15, 0, 0.1);
	
	sun = new Body(2,'yellow',sunPosition);
	earth = new Body(1, 'blue', earthOrbit);
	mars = new Body(0.5, 'red', marsOrbit);
}

// Обновляет объекты (на каждом кадре)
function updateObjects(time) {
	earth.update(time)
	mars.update(time)
}

// Отрисовка сцены на каждом кадре
function render(time) {
updateObjects(time / 1000);

controls.update();

	renderer.render(scene, camera);
			requestAnimationFrame(render);
	};

init();
initObjects();


requestAnimationFrame(render);
