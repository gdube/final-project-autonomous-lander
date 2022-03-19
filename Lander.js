class Lander {
	constructor({ x = 0, y = 0 }) {
		this.x = x;
		this.y = y;

		this.fuel = 1000;
		this.speed = 0.0025;
		this.angle = 0 * (Math.PI / 180);
		this.width = 15;
		this.height = 15;
		this.gravity = 0.003;
		this.acceleration = 0.009;
		this.velocity = {
			x: 0,
			y: 0
		};

		this.leftRocketActivated = false;
		this.centerRocketActivated = false;
		this.rightRocketActivated = false;

		this.startTime = new Date();
		this.fuelStats = [];
	}

	getCheckpointReadings(level) {
		const checkpoint = level.getCheckpointData();
		const centerX = this.x + (this.width / 2);
		const bottomY = this.y + this.height;

		const direction = checkpoint.x < this.x ? 'left' : 'right';
		const distance = Math.sqrt(
			Math.pow(checkpoint.x - centerX, 2) +
			Math.pow(checkpoint.y - bottomY, 2)
		);

		return { direction, distance };
	}

	getAltitudeReadings(level) {
		const sectionIndex = level.terrain.findIndex((section) => {
			return this.x >= section.x && this.x + this.width <= section.x + section.width;
		});

		const landerBase = (this.y + this.height);
		const leftSection = level.terrain[sectionIndex - 1];
		const centerSection = level.terrain[sectionIndex];
		const rightSection = level.terrain[sectionIndex + 1];

		return [
			leftSection ? leftSection.y - landerBase : -1,
			centerSection ? centerSection.y - landerBase : -1,
			rightSection ? rightSection.y - landerBase : -1
		];
	}

	leftRocketOn(state) {
		this.leftRocketActivated = state;
	}

	centerRocketOn(state) {
		this.centerRocketActivated = state;
	}

	rightRocketOn(state) {
		this.rightRocketActivated = state;
	}

	update({ canvas }) {
		if (this.fuel > 0) {
			const currentTime = new Date();
			const elapsedTime = currentTime.getTime() - this.startTime.getTime();

			if (this.leftRocketActivated) {
				this.angle -= (Math.PI / 180) * 0.5;
				this.fuel -= 0.5;

				this.fuelStats.push([
					this.fuel,
					elapsedTime,
				]);
			}

			if (this.centerRocketActivated) {
				const adjustedAngle = this.angle + (-90 * (Math.PI / 180));
				this.velocity.x += this.acceleration * Math.cos(adjustedAngle);
				this.velocity.y += this.acceleration * Math.sin(adjustedAngle);
				this.fuel--;

				this.fuelStats.push([
					this.fuel,
					elapsedTime,
				]);
			}

			if (this.rightRocketActivated) {
				this.angle += (Math.PI / 180) * 0.5;
				this.fuel -= 0.5;

				this.fuelStats.push([
					this.fuel,
					elapsedTime,
				]);
			}
		}

		if (this.x < 0 || this.x + this.width > canvas.width) {
			this.destroy = true;
		}

		if (this.y < 0 || this.y + this.height > canvas.height) {
			this.destroy = true;
		}

		if (this.fuel < 0) {
			this.fuel = 0;
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.y + this.height > (canvas.height - 20)) {
			this.y = (canvas.height - this.height - 20);

			if (this.velocity.x > 0) {
				this.velocity.x -= (this.acceleration * 1.5);
			} else {
				this.velocity.x = 0;
			}

			if (this.velocity.y > 1) {
				this.destroy = true;
			}
		} else {
			this.velocity.y += this.gravity;
		}
	}

	draw({ context }) {
		context.save();

		context.translate(this.x, this.y);
		context.rotate(this.angle);

		context.fillStyle = '#FFF';
		context.strokeStyle = "#FFF";

		context.beginPath();
		context.arc(this.width / 2, this.height / 3, this.width / 2, Math.PI, 2 * Math.PI);
		context.fillRect(0, (this.height / 3), this.width, (this.height / 3));
		context.stroke();
		context.closePath();

		context.beginPath();

		context.moveTo(0, (this.height / 3) * 2);
		context.lineTo(-2, this.height);
		context.moveTo(this.width, (this.height / 3) * 2);
		context.lineTo(this.width + 2, this.height);
		context.stroke();

		context.closePath();

		context.restore();
	}
}
