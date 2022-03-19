class Player extends Lander {
	constructor() {
		super({ x: 200, y: 580 });
		this.addEventListeners();
	}

	updateEngineStatus(event, state) {
		switch (event.key) {
			case 'ArrowLeft':
				this.leftRocketOn(state);
				break;
			case 'ArrowUp':
				this.centerRocketOn(state);
				break;
			case 'ArrowRight':
				this.rightRocketOn(state);
				break;
			default:
				break;
		}
	}

	addEventListeners() {
		document.addEventListener('keydown', (event) => {
			this.updateEngineStatus(event, true);
		});

		document.addEventListener('keyup', (event) => {
			this.updateEngineStatus(event, false);
		});
	}
}
