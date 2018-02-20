function editLastTrajectory(objects)
{			
	var body = objects[objects.length - 1];
	
	
		var dr = -body.trajectory.sma * body.trajectory.e;
		var curve = new THREE.EllipseCurve(
			dr * Math.cos(body.trajectory.aop), // aX
			dr * Math.sin(body.trajectory.aop), // aY
			body.trajectory.sma, body.trajectory.sma * Math.sqrt(1 - body.trajectory.e*body.trajectory.e),   // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			body.trajectory.aop               // aRotation
		);
		var path = new THREE.Path(curve.getPoints(150));
		var geometry = path.createPointsGeometry(150);
		var material = new THREE.LineBasicMaterial({color: 0x000000});
		geometry.rotateX(body.trajectory.inc);

		// Create the final Object3d to add to the scene
		var threeObj = new THREE.Line(geometry, material);

		threeObj.rotation.z = body.trajectory.raan;

		trajectoryObjects.add(threeObj);
	
	
	var value = prompt("select a trajectory option: e, sma, aop, inc, raan, ta, mu");
		if (value == "e")
		{
			value = prompt("input eccentricity");
			body.trajectory.e = value == null ? body.trajectory.e:Number(value);
		}
		
		if (value == "sma")
		{
			value = prompt("input small half-axis");
			body.trajectory.sma = value == null ? body.trajectory.sma:Number(value);
		}
		
		if (value == "aop")
		{
			value = prompt("input some angle");
			body.trajectory.aop = value == null ? body.trajectory.aop:Number(value);
		}
		
		if (value == "inc")
		{
			value = prompt("input some angle");
			body.trajectory.inc = value == null ? body.trajectory.inc:Number(value);
		}
		
		if (value == "raan")
		{
			value = prompt("input some angle");
			body.trajectory.raan = value == null ? body.trajectory.raan:Number(value);
		}
		
		if (value == "ta")
		{
			value = prompt("input true anomaly");
			body.trajectory.ta = value == null ? body.trajectory.ta:Number(value);
		}
		
		if (value == "mu")
		{
			value = prompt("input velocity");
			body.trajectory.mu = value == null ? body.trajectory.mu:Number(value);
		}

		
		body = 
			new Body(body.size,'black',
			new TrajectoryKeplerianOrbit
				(body.trajectory.parentTrajectory,
				 body.trajectory.e,
				 body.trajectory.sma,
				 body.trajectory.aop,
				 body.trajectory.inc,
				 body.trajectory.raan,
				 body.trajectory.ta,
				 body.trajectory.mu,
				 'green'),
				 body.orientation,false);
		
		console.log(objects);
		
		scene.add(new THREE.AxisHelper(5));
}