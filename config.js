// Canvas window dimensions
const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 600;

const AGENT = {
	FS: 0, // Finite State AI
	RL: 1, // Reinforced Learning AI
	PL: 2 // Player
};

const LEVEL = {
	TRAINING: {
		terrain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		launchPad: 1,
		landingPad: 15,
		gravity: 1
	},
	EASY: {
		terrain: [0, 0, 0, 1, 1, 1, 0, 0, 0],
		launchPad: 0,
		landingPad: 8,
		gravity: 1
	}
};

const AI_COUNT = 150;
const ITERATION_TIME_LIMIT_MS = 15000;
