var scene, camera, renderer, earth, mars, controls;


class Body
{
	constructor(size, color, trajectory, orientation)
	{
		var geometry = new THREE.SphereGeometry(size, 32, 32);
		var material = new THREE.MeshBasicMaterial({color: color, wireframe: true});

		geometry.rotateX(Math.PI / 2);
		this.threeObj = new THREE.Mesh(geometry, material);
		scene.add(this.threeObj);

		this.trajectory = trajectory;
		this.orientation = orientation;
	}

	update(time)
	{
		var pos = this.trajectory.getPosition(time);
		var angles = this.orientation.getAngles(time);

		this.threeObj.position.set(pos.x, pos.y, pos.z);
		this.threeObj.rotation.set(angles.x, angles.y, angles.z);

		this.trajectory.update(time);
	}
}

class Orientation
{
	constructor(angX, angY, angZ, angVelocityZ)
	{
		this.angX = angX;
		this.angY = angY;
		this.angZ = angZ;
		this.angVelocityZ = angVelocityZ;
	}

	getAngles(time)
	{
		return {
			x: this.angX,
			y: this.angY,
			z: this.angZ + this.angVelocityZ * time
		};
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
	update(time) {}
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

		if (this.parentTrajectory) {
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
	constructor(parentTrajectory, radius, startingAngle, angularVelocity, color)
	{
		super(parentTrajectory);

		this.r = radius;
		this.startingAngle = startingAngle;
		this.angularVelocity = angularVelocity;

		var curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			radius, radius,   // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		var path = new THREE.Path(curve.getPoints(150));
		var geometry = path.createPointsGeometry(150);
		var material = new THREE.LineBasicMaterial({color: color});

		// Create the final Object3d to add to the scene
		this.threeObj = new THREE.Line(geometry, material);

		scene.add(this.threeObj);
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

	update(time)
	{
		var pos = this.parentTrajectory.getPosition(time);
		this.threeObj.position.set(pos.x, pos.y, pos.z);
	}
}

class TrajectoryKeplerianOrbit extends TrajectoryAbstract
{
	constructor(parentTrajectory, e, sma, aop, inc, raan, ta, mu, color)
	{
		super(parentTrajectory);

		var dr = -sma * e;
		var curve = new THREE.EllipseCurve(
			dr * Math.cos(aop), // aX
			dr * Math.sin(aop), // aY
			sma, sma * Math.sqrt(1 - e*e),   // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			aop               // aRotation
		);
		var path = new THREE.Path(curve.getPoints(150));
		var geometry = path.createPointsGeometry(150);
		var material = new THREE.LineBasicMaterial({color: color});

		this.e = e;
		this.sma = sma;
		this.aop = aop;
		this.inc = inc;
		this.raan = raan;

		this.m0 = this.getMeanAnomalyByEccentricAnomaly(
			this.getEccentricAnomalyByTrueAnomaly(ta)
		);

		this.meanMotion = Math.sqrt(mu / sma) / sma;

		geometry.rotateX(inc);

		// Create the final Object3d to add to the scene
		this.threeObj = new THREE.Line(geometry, material);

		this.threeObj.rotation.z = raan;

		scene.add(this.threeObj);
	}

	getEccentricAnomalyByTrueAnomaly(ta)
	{
		var cos = Math.cos(ta);
		var sin = Math.sin(ta);
		var cosE = (this.e + cos) / (1 + this.e * cos);
     		var sinE = Math.sqrt(1 - this.e * this.e) * sin / (1 + this.e * cos);
		var ang = Math.acos(cosE);

		return (sinE > 0)
			? ang
			: (2 * Math.PI - ang);
	}


	getMeanAnomalyByEccentricAnomaly(ea)
	{
		return ea - this.e * Math.sin(ea);
	}

	getMeanAnomaly(time)
	{
		return this.m0 + this.meanMotion * time;
	}

	getEccentricAnomaly(time)
	{
		var M = this.getMeanAnomaly(time) / (2.0 * Math.PI);
		var maxIter = 30, i = 0;
		var maxError = 0.00000001;
		var E, F;

		M = 2.0 * Math.PI * (M - Math.floor(M));

		E = (this.e < 0.8) ? M : Math.PI;

		F = E - this.e * Math.sin(M) - M;

		while ((Math.abs(F) > maxError) && (i < maxIter)) {
			E = E - F / (1.0 - this.e * Math.cos(E));
			F = E - this.e * Math.sin(E) - M;
			i = i + 1;
		}

		return E;
	}

	getTrueAnomaly(time)
	{
		var E = this.getEccentricAnomaly(time);
		var phi = Math.atan2(Math.sqrt(1.0 - this.e * this.e) * Math.sin(E), Math.cos(E) - this.e);
		return (phi > 0) ? phi : (phi + 2 * Math.PI);
	}

	getPosition(time)
	{
		var parentPosition = this.parentTrajectory.getPosition(time);
		var ta = this.getTrueAnomaly(time);
		var r = this.sma * (1 - this.e*this.e) / (1 + this.e * Math.cos(ta));

		var pos = [r * Math.cos(ta), r * Math.sin(ta), 0];

		var Rot1 = [
			[Math.cos(this.aop), -Math.sin(this.aop), 0],
			[Math.sin(this.aop),  Math.cos(this.aop), 0],
			[                 0,                   0, 1]
		]; 												 //OZ
		var Rot2 = [
			[1,                  0,                   0],
			[0, Math.cos(this.inc), -Math.sin(this.inc)],
			[0, Math.sin(this.inc),  Math.cos(this.inc)] //OX
		];
		var Rot3 = [
			[Math.cos(this.raan), -Math.sin(this.raan), 0],
			[Math.sin(this.raan),  Math.cos(this.raan), 0],
			[                 0,                   0, 1] //OY
		];

		pos = multMatrixByVector(Rot1, pos);
		pos = multMatrixByVector(Rot2, pos);
		pos = multMatrixByVector(Rot3, pos);

		return {
			x: parentPosition.x + pos[0],
			y: parentPosition.y + pos[1],
			z: parentPosition.z + pos[2]
		};
	}

	update(time)
	{
		var pos = this.parentTrajectory.getPosition(time);
		this.threeObj.position.set(pos.x, pos.y, pos.z);
	}
}

function multMatrixByVector(matrix, vector)
{
	var result = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			result[i] += matrix[i][j] * vector[j];
		}
	}
	return result;
}

// Инициализирует сцену (1 раз)
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
}

// Создаёт объекты (1 раз)
function initObjects()
{
	var sunPosition = new TrajectoryStaticPosition(null, 0, 0, 0);
	var earthOrbit = new TrajectoryCircleOrbit(sunPosition, 50, 0, 0.2);
	var marsOrbit = new TrajectoryKeplerianOrbit(sunPosition, 0.4, 100, 0, 0, 0, 0, 10000, 'red');
	var plutoOrbit = new TrajectoryKeplerianOrbit(sunPosition,0.25,300,0,1,0,0,10000,'blue');
	var moonOrbit = new TrajectoryCircleOrbit(earthOrbit,2,0,0.2);
	
	earth = new Body(1, 'green', earthOrbit, new Orientation(0,0,0,1));
	mars = new Body(1, 'red', marsOrbit, new Orientation(0,0,0,1));
	sun = new Body(10,'yellow',sunPosition,new Orientation(0,0,0,0));
	pluto = new Body(3,'blue',plutoOrbit,new Orientation(0,0,0,5));
	moon = new Body(0.4,'white',moonOrbit,new Orientation(0,0,0,1));
}

// Обновляет объекты (на каждом кадре)
function updateObjects(time)
{
	earth.update(time)
	mars.update(time)
	sun.update(time)
	pluto.update(time)
	moon.update(time)
}

// Отрисовка сцены на каждом кадре
function render(time)
{
	updateObjects(time / 300);

	controls.update();

	renderer.render(scene, camera);
	requestAnimationFrame(render);
};

init();
initObjects();
requestAnimationFrame(render);
