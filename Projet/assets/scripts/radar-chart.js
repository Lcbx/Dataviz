function calculateBasicStatistics(data, columns, groupBy="Region") {
	const regionAverages = {};
	const regionCounts = {};
	const monthAverages = {};
	const monthCounts = {}; 
	let maximums = columns.map(() => 0.0);
	let minimums = columns.map(() => Number.MAX_VALUE);
	for (let i = 0; i < data.length; i++) {
		if (regionAverages.hasOwnProperty(data[i]["Region"]) == false) {
			regionAverages[data[i]["Region"]] = columns.map(() => 0.0);
			regionCounts[data[i]["Region"]] = 0;
		}
		let date = new Date(data[i]["Date"]);
		if (monthAverages.hasOwnProperty(date.getMonth()) == false) {
			monthAverages[date.getMonth()] = columns.map(() => 0.0);
			monthCounts[date.getMonth()] = 0;
		}
		for (let j = 0; j < columns.length; j++) {
			let currentValue = parseFloat(data[i][columns[j]])
			regionAverages[data[i]["Region"]][j] += currentValue;
			monthAverages[date.getMonth()][j] += currentValue;

			if (currentValue > maximums[j]) {
				maximums[j] = currentValue;
			}
			if (currentValue < minimums[j]) {
				minimums[j] = currentValue;
			}
		}
		regionCounts[data[i]["Region"]] += 1;
		monthCounts[date.getMonth()] += 1;
	}
	for (const region in regionAverages) {
		regionAverages[region] = regionAverages[region].map(x => x / regionCounts[region]);
	}
	for (const month in monthAverages) {
		monthAverages[month] = monthAverages[month].map(x => x / monthCounts[month]);
	}
	return { monthAverages, regionAverages, maximums, minimums };
}

function filterTop1(data, columns, country) {
	const top1Data = {};
	const top1Monthly = {};
	for (let i = 0; i < data.length; i++) {
		if (data[i]["Region"] == country && data[i]["Position"] == 1) {
			const date = new Date(data[i]["Date"]);
			top1Data[data[i]["Track.Name"]] = columns.map(v => data[i][v]);
			top1Monthly[date.getMonth()] = [];
			[data[i]["Track.Name"]]
		}
	}
	return top1Data;
}

function createScale(radius, maximumValue) {
	return d3.scaleLinear()
		.range([0, radius])
		.domain([0, maximumValue]);
}

function createColorScale(data) {
	return d3.scaleOrdinal(d3.schemeSet3)
		.domain(Object.keys(data));
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

function drawTicks(g, nAxis, radius, scaleTicks) {
	const ticksGroup = g.append("g").attr("class", "ticks-group");
	const ticks = d3.range(scaleTicks).map(d => Array(nAxis).fill((d + 1) / scaleTicks));

	const radialLine = d3.lineRadial()
		.radius(d => radius * d)
		.angle((_, i) => i * ((2*Math.PI) / nAxis) + Math.PI/2)
		.curve(d3.curveLinearClosed);

	ticksGroup.selectAll(".tick")
		.data(ticks)
		.enter()
//		.append("circle")
//		.attr("r", d => radius * d)
//		.attr("cx", radius)
//		.attr("cy", radius)
		.append("path")
		.attr("d", d => radialLine(d))
		.attr("transform", `translate(${radius}, ${radius})`)
		.attr("stroke", "gray")
		.attr("stroke-width", "1px")
		.attr("fill", "none")
		.attr("class", "tick");
}

function getToolTipText(music) {
	return `${music}`;
}

function drawData(g, data, rScale, color, radius) {
	const dataGroup = g.append("g").attr("class", "data-group");
	const radialLine = d3.lineRadial()
		.radius(d => rScale(d))
		.angle((_, i) => i * ((2*Math.PI) / Object.values(data)[0].length) + Math.PI/2)
		.curve(d3.curveLinearClosed);

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html((d, i) => Object.keys(data)[i]);
	dataGroup.call(tip);

	dataGroup.selectAll("path")
		.data(Object.values(data))
		.enter()
		.append("path")
		.attr("d", d => radialLine(d))
		.attr("transform", `translate(${radius}, ${radius})`)
		.style("fill", (_, i) => color(Object.keys(data)[i]))
		.style("opacity", "0.7")
		.on('mouseover', function (d, i) {
			d3.selectAll(".data-group path")
				.style("opacity", 0.1);
			d3.select(this)
				.style("opacity", 0.8);
			tip.show(d, i);
		})
		.on('mouseout', function(d) {
			d3.selectAll(".data-group path")
				.style("opacity", 0.7);
			tip.hide(d);
		});
}
