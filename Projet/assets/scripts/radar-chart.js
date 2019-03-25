function calculateBasicStatistics(data, columns) {
	let averages = columns.map(() => 0.0);
	let maximums = columns.map(() => 0.0);
	let minimums = columns.map(() => Number.MAX_VALUE);
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < columns.length; j++) {
			let currentValue = parseFloat(data[i][columns[j]])
			averages[j] += currentValue;
			if (currentValue > maximums[j]) {
				maximums[j] = currentValue;
			}
			if (currentValue < minimums[j]) {
				minimums[j] = currentValue;
			}
		}
	}
	averages = averages.map(x => x / data.length);
	return { averages, maximums, minimums };
}

function drawAxes(g, axisNames, radius) {
	const axesGroup = g.append("g").attr("class", "axes-group");
	axesGroup.selectAll(".axis")
		.data(axisNames)
		.enter()
		.append("line")
		.attr("class", "axis")
		.attr("x1", radius)
		.attr("y1", radius)
		.attr("x2", (_, i) => radius + Math.cos(((2*Math.PI)/axisNames.length) * i) * radius)
		.attr("y2", (_, i) => radius + Math.sin(((2*Math.PI)/axisNames.length) * i) * radius)
		.style("stroke", "black")
		.style("stroke-width", "2px");
}

function drawTicks(g, axisNames, scaleTicks) {
	const ticksGroup = g.append("g").attr("class", "ticks-group");
	for (let i = 0; i < scaleTicks; i++) {
		ticksGroup.selectAll(".tick")
			.data(axisNames)
			.enter()
			.append("path")
	}
}

function handleChanges() {
	
}