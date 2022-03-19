/**
 * This class was omitted from the project due to performance issues but I am
 * leaving it here for future use and context.
*/

class SmokeParticle {
	constructor({ x, y, velocity, angle }) {
		this.x = x;
		this.y = y;
		this.width = 3;
		this.height = 3;
		this.velocity = {
			x: velocity.x / 10,
			y: velocity.y / 10
		};
		this.opacity = 0.3;
		this.angle = angle;
		this.acceleration = 0.009 / 1000;
	}

	update() {
		this.velocity.x -= this.acceleration * Math.cos(this.angle);
		this.velocity.y -= this.acceleration * Math.sin(this.angle);

		this.width += 0.05;
		this.height += 0.05;
		this.opacity -= 0.001;

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.opacity <= 0) {
			this.destroy = true;
		}
	}

	draw({ context }) {
		context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
		context.fillRect(this.x - this.width / 2, this.y + this.height / 2, this.width, this.height);
	}
}
