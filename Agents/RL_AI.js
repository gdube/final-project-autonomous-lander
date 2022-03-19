class RL_AI extends Lander {
	constructor(params = {}) {
		super({ x: 200, y: 580 });

		this.score = 0;
		this.network = params.network ? params.network : new NeuralNetwork({
			inputNodes: 4,
			hiddenNodes: 6,
			outputNodes: 3
		});
	}

	update({ canvas, level }) {
		const oldCheckpointDistance = this.getCheckpointReadings(level).distance;
		super.update({ canvas, level });
		const newCheckpointDistance = this.getCheckpointReadings(level).distance;

		if (newCheckpointDistance < oldCheckpointDistance) {
			this.score++;
		} else {
			this.score--;
		}

		if (newCheckpointDistance <= 100) {
			this.score++;
		}

		const altitudeReadings = this.getAltitudeReadings(level);

		const output = this.network.predict([
			altitudeReadings[1],
			newCheckpointDistance,
			this.velocity.x,
			this.velocity.y,
		]);

		const leftRocketState = output[0];
		const centerRocketState = output[1];
		const rightRocketState = output[2];

		this.leftRocketOn(leftRocketState > 0.3);
		this.centerRocketOn(centerRocketState > 0.5);
		this.rightRocketOn(rightRocketState > 0.3);
	}

	mutate(rate) {
		this.network.mutate(rate);
	}

	draw({ context }) {
		super.draw({ context });
	}
}
