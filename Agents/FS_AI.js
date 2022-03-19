class FS_AI extends Lander {
	constructor({ level }) {
		super({ x: 200, y: 580 });

		this.checkpointReached = false;
		this.acceleration *= 0.8;

		this.verticalTraversalCompleted = false;
		this.horizontalTraversalCompleted = false;
		this.rotationCompleted = false;
		this.slowDownCompleted = false;

		this.statsLogged = false;

		this.level = level;

		this.checkpoint = this.getCheckpointReadings(level);
		this.yPeak = this.checkpoint.distance / 2;
	}

	handleVerticalTraversal() {
		this.centerRocketOn(true);

		if (this.y <= this.yPeak) {
			this.centerRocketOn(false);
			this.verticalTraversalCompleted = true;
		}
	}

	handleHorizontalTraversal() {
		if (this.angle < Math.PI / 2) {
			this.rightRocketOn(true);
		} else {
			this.rightRocketOn(false);

			if (this.x < this.checkpoint.distance / 2.8) {
				this.centerRocketOn(true);
			} else {
				this.centerRocketOn(false);
				this.horizontalTraversalCompleted = true;
			}
		}
	}

	handleRotation() {
		if (this.angle > 0) {
			this.leftRocketOn(true);
		} else {
			this.leftRocketOn(false);
			this.rotationCompleted = true;
		}
	}

	handleSlowDown() {
		const altitudeReadings = this.getAltitudeReadings(this.level);
		const primarySensor = altitudeReadings[1];

		if (primarySensor > -1 && primarySensor < 180 && primarySensor < 160) {
			this.centerRocketOn(true);

			if (primarySensor < 1) {
				this.slowDownCompleted = true;
				this.centerRocketOn(false);
			}
		} else if (primarySensor > -1) {
			this.centerRocketOn(false);
		}
	}

	logStatistics() {
		console.log('completed!');
		this.statsLogged = true;
		const fuelLogs = fuelLogToCsv(this.fuelStats);
		console.log(fuelLogs);
	}

	update({ canvas, level }) {
		super.update({ canvas, level });

		if (!this.verticalTraversalCompleted) {
			this.handleVerticalTraversal();
		} else if (!this.horizontalTraversalCompleted) {
			this.handleHorizontalTraversal();
		} else if (!this.rotationCompleted) {
			this.handleRotation();
		} else if (!this.slowDownCompleted) {
			this.handleSlowDown();
		} else if (!this.statsLogged) {
			this.logStatistics();
		}
	}

	draw({ context }) {
		super.draw({ context });
	}
}
