function fuelLogToCsv(data, iteration = 1) {
	let content = '';

	data.forEach(([fuel, time]) => {
		content += `\n${iteration}, ${time}, ${fuel}`;
	});

	return content;
}

function SaveCsvToPage(id, values) {
	const textarea = document.getElementById(`${id}`);
	textarea.innerHTML += values;
}
