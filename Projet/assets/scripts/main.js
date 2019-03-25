/**
 * Fichier principal initialisant l'ensemble des graphiques.
 */

/**
 * Ajoute un element
 * @param {string} selectorString 
 * @param {integer} width 
 * @param {integer} height 
 */
function addSvgToHtml(selectorString, width, height) {
	const svg = d3.select(selectorString)
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	return svg.append("g");
}


(function (d3, localization) {
	"use strict";
	/**
	 * Radar chart initialisation 
	 */
	// Radar chart constants
	const radarChartAxes = [
		"danceability", "energy", "speechiness", "acousticness",
		"instrumentalness", "liveness", "valence"
	];
	const radarChartConfiguration = {
		radius: 200,
		scaleTicks: 4
	};
	const radarChartMargin = { top: 10, right: 10, bottom: 10, left: 10 };
	const radarChartWidth = 960 - radarChartMargin.right - radarChartMargin.left;
	const radarChartHeight = 500 - radarChartMargin.top - radarChartMargin.bottom;
	// Drawing the base of the graph
	const radarChartGroup = addSvgToHtml(
		"#radar-chart",
		radarChartWidth,
		radarChartHeight,
	);
	const radarChartScale = createScale(radarChartConfiguration.radius, 1.0);
	drawAxes(radarChartGroup, radarChartAxes, radarChartConfiguration.radius);
	drawAxisNames(radarChartGroup, radarChartAxes, radarChartConfiguration.radius);
	drawTicks(radarChartGroup, radarChartConfiguration.radius, radarChartConfiguration.scaleTicks);

	d3.csv('./data/Data treatment/completeDataset.csv').then(data => {
		// Radar chart setup
		const radarChartData = calculateBasicStatistics(data, radarChartAxes);
		drawData(radarChartGroup, radarChartData.averages, radarChartScale, radarChartConfiguration.radius);
	});

	d3.csv("./data/bumpChartData.csv").then(function (data) {

        var bump = bumpChartGroup.append("g")
                    .attr("class", "bump")
                    .selectAll("g")
                    .data(data)
                    .enter()
                    .append("g");

		console.log(data)
	})

	var margin = { top: 10, right: 10, bottom: 10, left: 10 },
		width = 900 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		pairId = 0;

	/*** bump chart scales ***/
	var xScale = d3.scaleTime()
		.domain([new Date(2017, 0, 1), new Date(2017, 11, 1)])
		.rangeRound([0, width - margin.right - 50]);

	var yScale = d3.scaleLinear()
		.domain([1, 11])
		.range([0, height - 50]);

	/*** bump chart SVG ***/
	// use addSvgToHtml?
	var bumpChartGroup = d3.select("#bumpChartDiv").append("svg")
		.attr("id", "bumpChartSvg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B"));

	var tickLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", ">10"];
	var yAxis = d3.axisLeft(yScale).tickFormat(function (d, i) { return tickLabels[i] });

	createAxes(bumpChartGroup, xAxis, yAxis, height, width);

	var xTangent = 40,
		yPadding = .3;


})(d3, localization);
