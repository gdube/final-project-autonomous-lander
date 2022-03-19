class Level {
	constructor({ level, canvas }) {
		const { terrain, launchPad, landingPad, gravity } = level;

		this.terrain = this.generateTerrainData(terrain, canvas.width);
		this.launchPad = launchPad;
		this.landingPad = landingPad;
		this.gravity = gravity;
	}

	generateTerrainData(terrain, canvasWidth) {
		const sectionWidth = canvasWidth / terrain.length;
		const sectionHeight = 2;

		return terrain.map((_section, index) => ({
			x: sectionWidth * index,
			y: 580,
			width: sectionWidth,
			height: sectionHeight,
			color: index % 2 ? '#FFFFFF' : '#C8C8C8'
		}));
	}

	getCheckpointData() {
		return this.terrain[this.landingPad];
	}

	update() { }

	draw({ context }) {
		this.terrain.forEach(({ x, y, width, height, color }, index) => {

			if (index === this.landingPad) {
				context.fillStyle = 'blue';
			} else if (index === this.launchPad) {
				context.fillStyle = 'green';
			} else {
				context.fillStyle = color;
			}

			context.fillRect(
				x,
				y,
				width,
				height
			);
		});
	}
}
