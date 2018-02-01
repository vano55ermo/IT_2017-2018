			var bodyOrbit = new TrajectoryKeplerianOrbit(new TrajectoryStaticPosition(null, 0, 0, 0), 0.5, 30, 2, 2, 0, 0, 10000, 'yellow');
			var body = new Body(1,'yellow', bodyOrbit, new Orientation(0,0,0,1));
			
			showPrompt("выберите вводимый параметр: e, sma, aop, inc, raan, ta, mu, color", 
			function(value) 
			{
				if (value == "e")
				{
					showPromt("введите эксцентриситет"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.e = value == null ? body.TrajectoryKeplerianOrbit.e:Number(value);
					})
				}
				
				if (value == "sma")
				{
					showPromt("введите малую полуось"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.sma = value == null ? body.TrajectoryKeplerianOrbit.sma:Number(value);
					})
				}
				
				if (value == "aop")
				{
					showPromt("введите какой-то угол"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.aop = value == null ? body.TrajectoryKeplerianOrbit.aop:Number(value);
					})
				}
				
				if (value == "inc")
				{
					showPromt("введите какой-то угол"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.inc = value == null ? body.TrajectoryKeplerianOrbit.inc:Number(value);
					})
				}
				
				if (value == "raan")
				{
					showPromt("введите какой-то угол"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.raan = value == null ? body.TrajectoryKeplerianOrbit.raan:Number(value);
					})
				}
				
				if (value == "ta")
				{
					showPromt("введите истинную аномалию"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.ta = value == null ? body.TrajectoryKeplerianOrbit.ta:Number(value);
					})
				}
				
				if (value == "mu")
				{
					showPromt("введите скорость"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.mu = value == null ? body.TrajectoryKeplerianOrbit.mu:Number(value);
					})
				}
				
				if (value == "color")
				{
					showPromt("введите цвет"
					function(value)
					{
						body.TrajectoryKeplerianOrbit.color = value == null ? body.TrajectoryKeplerianOrbit.color:value;
					})
				}
			});