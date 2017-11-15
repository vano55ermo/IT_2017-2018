class Body
{
	constructor(inputSize, inputColor, inputTrajectory)
	{
		this.size = inputSize;
this.color = inputColor;
this.trajectory = inputTrajectory;
}

render(time)
{
	var pos = this.trajectory.getPosition(time);

	context.beginPath();
	context.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI);
	context.fillStyle = this.color;
	context.fill();

	this.trajectory.render(time);
}
}

// Родительский класс (абстрактный)
class Trajectory
{
	constructor(parentTrajectory)
	{
		this.parentTrajectory = parentTrajectory;
}

getPosition(time) {}
render(time) {}
}

// Дочерний класс (наследник Trajectory)
class StaticPosition extends Trajectory
{
	constructor(parentTrajectory, x, y)
{
	// Вызов родительского конструктора
// Метод constructor класса Trajectory
		super(parentTrajectory);

		// Создание свойств, характерных
// для класса StaticPosition
this.x = x;
this.y = y;
}

getPosition(time)
{
	var parentPosition = {x: 0, y: 0};

	if (this.parentTrajectory)
{
		parentPosition = this.parentTrajectory.getPosition(time);
}

	return {
x: parentPosition.x + this.x,
y: parentPosition.y + this.y
};
}
}

class CircleOrbit extends Trajectory
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
		y: parentPosition.y + this.r * Math.sin(angle)
};
}

render(time)
{
	var pos = this.parentTrajectory.getPosition(time);

	context.beginPath();
	context.arc(pos.x, pos.y, this.r, 0, 2 * Math.PI);
	context.strokeStyle = "grey";
	context.lineWidth = 2;
	context.stroke();
}
}

function update()
{
	time = time + 0.1;
	
	context.clearRect(0, 0, 1500, 900);
	earth.render(time);
	sun.render(time);
}

var time = 0;
var sunTrajectory = new StaticPosition(null, 500, 400);
var earthTrajectory = new CircleOrbit(sunTrajectory, 300, 0, 1);
var context = document.getElementById("mainCanvas").getContext("2d");
var earth = new Body(40, "blue", earthTrajectory);
var sun = new Body(100,"yellow",sunTrajectory);

setInterval(update, 50);
