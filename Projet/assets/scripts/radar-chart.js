function getRadarChartData(data, columns) {
	const radarChartData = [];
	for (let i = 0; i < data.length; i++) {
		radarChartData[i] = columns.map(val => data[i][val]);
	}
	return radarChartData;
}

function createScale(radius, maximumValue) {
	return d3.scaleLinear()
		.range([0, radius])
		.domain([0, maximumValue]);
}

function createColorScale(data) {
	return d3.scaleOrdinal(d3.schemeCategory10)
		.domain(data.map(val => val["Id"]));
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
		.attr("x2", (_, i) => radius + Math.cos(((2 * Math.PI) / axisNames.length) * i) * radius)
		.attr("y2", (_, i) => radius + Math.sin(((2 * Math.PI) / axisNames.length) * i) * radius)
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
		.attr("x", (_, i) => radius + Math.cos(((2 * Math.PI) / axisNames.length) * i) * radius * 0.9)
		.attr("y", (_, i) => radius + Math.sin(((2 * Math.PI) / axisNames.length) * i) * radius * 0.9)
		.style("font-size", "14px");
}

function drawTicks(g, nAxis, radius, scaleTicks) {
	const ticksGroup = g.append("g").attr("class", "ticks-group");
	const ticks = d3.range(scaleTicks).map(d => Array(nAxis).fill((d + 1) / scaleTicks));

	const radialLine = d3.lineRadial()
		.radius(d => radius * d)
		.angle((_, i) => i * ((2 * Math.PI) / nAxis) + Math.PI / 2)
		.curve(d3.curveLinearClosed);

	ticksGroup.selectAll(".tick")
		.data(ticks)
		.enter()
		.append("path")
		.attr("d", d => radialLine(d))
		.attr("transform", `translate(${radius}, ${radius})`)
		.attr("stroke", "gray")
		.attr("stroke-width", "1px")
		.attr("fill", "none")
		.attr("class", "tick");
}

function getToolTipText(music) {
	return `<span style="font-weight:bold">${music["Track.Name"]}</span><br>
		<span style="font-style:italic" style="font-weight:bold">${music["Artist"]}</span>`;
}

function updateRadarChartData(g, data, rScale, color, radius, columns) {
	d3.select("#radar-chart g.data-group").remove();
	drawData(g, data, rScale, color, radius, columns);
}

function drawData(g, data, rScale, color, radius, columns) {
	const dataGroup = g.append("g").attr("class", "data-group");
	const radialLine = d3.lineRadial()
		.radius(d => rScale(d))
		.angle((_, i) => i * ((2 * Math.PI) / columns.length) + Math.PI / 2)
		.curve(d3.curveLinearClosed);

	const areaTip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10, 0])
		.html((d, i) => getToolTipText(data[i]));
	dataGroup.call(areaTip);

	dataGroup.selectAll("path")
		.data(getRadarChartData(data, columns))
		.enter()
		.append("path")
		.attr("d", d => radialLine(d))
		.attr("transform", `translate(${radius}, ${radius})`)
		.style("fill", (_, i) => color(data[i]["Id"]))
		.style("opacity", "0.7")
		.on("mouseover", function (d, i) {
			d3.selectAll(".data-group path")
				.style("opacity", 0.1);
			d3.select(this)
				.style("opacity", 0.9);
			areaTip.show(d, i);
		})
		.on("mouseout", function (d) {
			d3.selectAll(".data-group path")
				.style("opacity", 0.7);
			areaTip.hide(d);
		});
}

mapCountryNameCode = {
	'Guatemala': 'gt',
	'Taiwan': 'tw',
	'Argentina': 'ar',
	'Lithuania': 'lt',
	'Turkey': 'tr',
	'United Kingdom': 'uk',
	'Czech Republic': 'cz',
	'Iceland': 'is',
	'Austria': 'at',
	'Germany': 'de',
	'Bolivia': 'bo',
	'Malaysia': 'my',
	'Slovakia': 'sk',
	'Papua New Guinea': 'PG',
	'Poland': 'pl',
	'Philippines': 'ph',
	'Indonesia': 'id',
	'Belgium': 'be',
	'Chile': 'cl',
	'Ireland': 'ie',
	'Norway': 'no',
	'Italy': 'it',
	'Singapore': 'sg',
	'Denmark': 'dk',
	'Japan': 'jp',
	'Colombia': 'co',
	'Canada': 'ca',
	'Netherlands': 'nl',
	'Greece': 'gr',
	'Peru': 'pe',
	'Estonia': 'ee',
	'United States of America': 'us',
	'Panama': 'pa',
	'Switzerland': 'ch',
	'Dominican Republic': 'do',
	'El Salvador': 'sv',
	'France': 'fr',
	'Uruguay': 'uy',
	'Hungary': 'hu',
	'Spain': 'es',
	'Portugal': 'pt',
	'Hong Kong': 'hk',
	'Finland': 'fi',
	'New Zealand': 'nz',
	'Australia': 'au',
	'Costa Rica': 'cr',
	'Global': 'global',
	'Latvia': 'lv',
	'Ecuador': 'ec',
	'Brazil': 'br',
	'Honduras': 'hn',
	'Sweden': 'se',
	'Mexico': 'mx',
}