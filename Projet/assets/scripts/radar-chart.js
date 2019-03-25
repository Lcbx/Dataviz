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

function createScale(radius, maximumValue) {
	return d3.scaleLinear()
		.range([0, radius])
		.domain([0, maximumValue]);
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
		.attr("stroke", "black")
		.attr("stroke-width", "1px");
}

function drawAxisNames(g, axisNames, radius) {
	const axisNamesGroup = g.append("g").attr("class", "axis-names-group");
	axisNamesGroup.selectAll(".name")
		.data(axisNames)
		.enter()
		.append("text")
		.attr("class", "name")
		.text(d => d.charAt(0).toUpperCase() + d.slice(1))
		.attr("x", (_, i) => radius + Math.cos(((2*Math.PI)/axisNames.length) * i) * radius * 0.9)
		.attr("y", (_, i) => radius + Math.sin(((2*Math.PI)/axisNames.length) * i) * radius * 0.9)
		.style("font-size", "14px");
}

function drawTicks(g, radius, scaleTicks) {
	const ticksGroup = g.append("g").attr("class", "ticks-group");
	const ticks = d3.range(scaleTicks).map(d => (d + 1) / scaleTicks);
	ticksGroup.selectAll(".tick")
		.data(ticks)
		.enter()
		.append("circle")
		.attr("r", d => radius * d)
		.attr("cx", radius)
		.attr("cy", radius)
		.attr("stroke", "gray")
		.attr("stroke-width", "1px")
		.attr("fill", "none");
}

function drawData(g, data, rScale, radius) {
	const dataGroup = g.append("g").attr("class", "data-group");
	const radialLine = d3.lineRadial()
		.radius(d => rScale(d))
		.angle((_, i) => i * ((2*Math.PI) / data.length) + Math.PI/2)
		.curve(d3.curveLinearClosed);

	dataGroup.selectAll("path")
		.data([data])
		.enter()
		.append("path")
		.attr("d", d => radialLine(d))
		.attr("transform", `translate(${radius}, ${radius})`)
		.style("stroke", "green")
		.style("stroke-width", "2px")
		.style("fill", "none");
}
