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
		
		objects[objects.length] = this;
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