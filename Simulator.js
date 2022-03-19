class Simulator {
	constructor({ canvas, width, height, agent, level }) {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d', {
			alpha: false,
		});

		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;

		this.canvas.width = width;
		this.canvas.height = height;

		this.running = false;

		this.objects = [];
		this.activeObjects = [];
		this.level = new Level({
			level,
			canvas
		});
		this.agent = agent;

		this.stats = {
			time: (new Date()).getTime(),
			iterations: 0,
			fuel: 0,

		};

		tf.setBackend('cpu');

		this.handleKeypressEvents();

		switch (this.agent) {
			case AGENT.RL:
				this.setupRLState();
				break;
			case AGENT.FS:
				this.setupFSState(this.level);
				break;
			default:
				this.setupPLState();
				break;
		}
	}

	setupRLState() {
		this.elapsedTime = (new Date()).getTime();

		for (let i = 0; i < AI_COUNT; i++) {
			const lander = new RL_AI();
			this.objects.push(lander);
		}

		this.activeObjects = this.objects;
	}

	setupFSState(level) {
		const lander = new FS_AI({ level });
		this.objects.push(lander);
		this.activeObjects = this.objects;
	}

	setupPLState() {
		const lander = new Player();
		this.objects.push(lander);
		this.activeObjects = this.objects;
	}

	selectBestVariants() {
		let index = 0;
		let r = Math.random();

		while (r > 0) {
			r = r - this.objects[index].fitness;
			index++;
		}

		index--;

		const winner = this.objects[index];
		const network = winner.network.clone();

		const newVariant = new RL_AI({ network });
		newVariant.mutate(0.2);

		return newVariant;
	}

	findBestVariant() {
		const bestVariant = this.objects.reduce((variant1, variant2) => {
			return variant1.score > variant2.score ? variant1 : variant2;
		});

		return bestVariant;
	}

	nextGeneration() {
		this.stats.iterations++;
		this.elapsedTime = (new Date()).getTime();
		this.stats.time = this.elapsedTime;

		console.log('next generation...');
		const bestVariant = this.findBestVariant();
		const fuelStats = fuelLogToCsv(bestVariant.fuelStats, this.stats.iterations);
		SaveCsvToPage('fuelStats', fuelStats);

		let totalScore = 0;
		this.objects.forEach(object => totalScore += object.score);

		this.objects.map((object, index, objectList) => {
			objectList[index].fitness = (object.score / totalScore) || 0;
		});

		const newObjects = [];
		for (let i = 0; i < AI_COUNT; i++) {
			const variant = this.selectBestVariants();
			newObjects.push(variant);
		}

		this.objects = newObjects;
		this.activeObjects = this.objects;
	}

	start() {
		console.log('starting...');
		this.running = true;
		this.loop();
	}

	stop() {
		console.log('stopping...');
		this.running = false;
	}

	update() {
		this.activeObjects = this.activeObjects.filter(object => !object.destroy);

		let totalFuel = 0;
		this.activeObjects.forEach(({ fuel }) => totalFuel += fuel);
		this.stats.fuel = totalFuel / this.activeObjects.length;

		const tooLong = (new Date()).getTime() - this.elapsedTime > ITERATION_TIME_LIMIT_MS;

		if (this.agent === AGENT.RL && (this.activeObjects.length === 0 || tooLong)) {
			this.nextGeneration();
		}

		this.activeObjects.forEach(object => object.update(this));
		this.level.update(this);
	}

	drawStats() {
		this.context.fillStyle = "#FFFFFF";

		const startTime = this.stats.time;
		const currentTime = new Date().getTime();
		const simulationSeconds = (currentTime - startTime) / 1000;

		this.context.fillText(`Iterations: ${this.stats.iterations}`, 10, 20);
		this.context.fillText(`Elapsed Time: ${simulationSeconds.toFixed(2)}s`, 10, 40);
		this.context.fillText(`Average Fuel: ${this.stats.fuel.toFixed(2)}`, 10, 60);
		this.context.fillText(`Active Objects: ${this.activeObjects.length}`, 10, 80);
	}

	draw() {
		// this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = '#000';
		this.context.font = '12px Helvetica';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.activeObjects.forEach(object => object.draw(this));
		this.level.draw(this);

		this.drawStats();
	}

	loop() {
		if (this.running) {
			this.update();
			this.draw();
			window.requestAnimationFrame(this.loop.bind(this));
		}
	}

	handleKeypressEvents() {
		document.addEventListener('keypress', (event) => {
			if (event.key == '1') {
				this.stop();
			} else if (event.key == '2') {
				this.start();
			} else if (event.key == '3') {
				this.nextGeneration();
			}
		});
	}
}
