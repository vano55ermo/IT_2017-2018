// Отрисовка сцены на каждом кадре
function render(time)
{
	updateObjects(time / 1000);

	controls.update();

	renderer.render(scene, camera);
	requestAnimationFrame(render);
};

function onMouseMove(event)
{
	mouseCoords.x = event.clientX / window.innerWidth * 2 - 1;
	mouseCoords.y = -event.clientY / window.innerHeght * 2 + 1;
	console.log(mouseCoords);
}

init();
initObjects();
requestAnimationFrame(render);