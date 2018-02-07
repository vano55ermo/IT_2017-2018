

var value;

function editLastTrajectory(body)
{			
	value = prompt("выберите вводимый параметр: e, sma, aop, inc, raan, ta, mu, color");
		if (value == "e")
		{
			value = prompt("введите эксцентриситет");
			body.trajectory.e = value == null ? body.trajectory.e:Number(value);
		}
		
		if (value == "sma")
		{
			value = prompt("введите малую полуось");
			body.trajectory.sma = value == null ? body.trajectory.sma:Number(value);
		}
		
		if (value == "aop")
		{
			value = prompt("введите какой-то угол");
			body.trajectory.aop = value == null ? body.trajectory.aop:Number(value);
		}
		
		if (value == "inc")
		{
			value = prompt("введите какой-то угол");
			body.trajectory.inc = value == null ? body.trajectory.inc:Number(value);
		}
		
		if (value == "raan")
		{
			value = prompt("введите какой-то угол");
			body.trajectory.raan = value == null ? body.trajectory.raan:Number(value);
		}
		
		if (value == "ta")
		{
			value = prompt("введите истинную аномалию");
			body.trajectory.ta = value == null ? body.trajectory.ta:Number(value);
		}
		
		if (value == "mu")
		{
			value = prompt("введите скорость");
			body.trajectory.mu = value == null ? body.trajectory.mu:Number(value);
		}
		
		if (value == "color")
		{
			value = prompt("введите цвет");
			body.trajectory.color = value == null ? body.trajectory.color:value;
		}
}