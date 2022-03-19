const canvas = document.querySelector('canvas');

const simulation = new Simulator({
	canvas,
	width: WINDOW_WIDTH,
	height: WINDOW_HEIGHT,
	agent: AGENT.RL,
	level: LEVEL.TRAINING
});

simulation.start();
