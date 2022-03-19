/**
 * Components of this class were inspired by the YouTube tutorial entitled
 * "11.3 Neuroevolution Flappy Bird with Tensorflow.js".
 *
 * Reference:
 * [13] Shiffman, D. (2019, April 24). 11.3 Neuroevolution Flappy Bird with
	TensorFlow.js. YouTube. [online] Available at:
	<https://www.youtube.com/watch?v=cdUNkwXx-I4> [Accessed 18 March, 2022].
 */

class NeuralNetwork {
	constructor({ model, inputNodes, hiddenNodes, outputNodes }) {
		this.inputNodes = inputNodes;
		this.hiddenNodes = hiddenNodes;
		this.outputNodes = outputNodes;
		this.model = model ? model : this.createModel();
	}

	clone() {
		return tf.tidy(() => {
			const modelClone = this.createModel();
			const weights = this.model.getWeights();
			const weightCopies = weights.map(weight => weight.clone());

			modelClone.setWeights(weightCopies);

			return new NeuralNetwork({
				model: modelClone,
				inputNodes: this.inputNodes,
				hiddenNodes: this.hiddenNodes,
				outputNodes: this.outputNodes
			});
		});
	}

	mutate(rate) {
		tf.tidy(() => {
			const weights = this.model.getWeights();
			const mutatedWeights = [];

			weights.forEach((tensor, x) => {
				const outputs = tensor.dataSync().slice();

				outputs.forEach((weight, y, outputList) => {
					if (Math.random() < rate) {
						outputList[y] = weight + Math.random();
					}
				});

				const newTensor = tf.tensor(outputs, tensor.shape);
				mutatedWeights[x] = newTensor;
			});

			this.model.setWeights(mutatedWeights);
		});
	}

	dispose() {
		this.model.dispose();
	}

	predict(inputs) {
		return tf.tidy(() => {
			const tensor = tf.tensor2d([inputs]);
			const prediction = this.model.predict(tensor);
			return prediction.dataSync();
		});
	};

	createModel() {
		const model = tf.sequential();

		const hiddenLayer = tf.layers.dense({
			units: this.hiddenNodes,
			inputShape: [this.inputNodes],
			activation: 'sigmoid'
		});

		const outputLayer = tf.layers.dense({
			units: this.outputNodes,
			activation: 'softmax'
		});

		model.add(hiddenLayer);
		model.add(outputLayer);

		return model;
	}
};
