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
	/***************/
	/* Radar-Chart */
	/***************/
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
	drawTicks(radarChartGroup, radarChartAxes.length, radarChartConfiguration.radius, radarChartConfiguration.scaleTicks);

	d3.csv('./data/Data treatment/completeDataset.csv').then(data => {
		// Radar chart setup
		const radarChartData = calculateBasicStatistics(data, radarChartAxes);
		const radarChartColor = createColorScale(radarChartData.regionAverages);
		drawData(radarChartGroup, radarChartData.monthAverages, radarChartScale,
			radarChartColor, radarChartConfiguration.radius);
	});

    /**************************/
    /*** bump chart creation ***/
    /**************************/

    /*** layout parameters ***/
	var margin = { top: 20, right: 20, bottom: 30, left: 20 },
		width = 900 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	/*** bump chart scales ***/
	var xDomain = ["2017-01-01", "2017-02-01", "2017-03-01", "2017-04-01",
					"2017-05-01", "2017-06-01", "2017-07-01", "2017-08-01",
					"2017-09-01", "2017-10-01", "2017-11-01", "2017-12-01"];
	var xScale = d3.scalePoint()
		.domain(xDomain)
		.range([0, width - margin.right - margin.left]),
	    yScale = d3.scaleLinear()
		.domain([1, 11])
        .range([0, height - margin.bottom]);
        
    /*** bump chart axes ***/
	var xTickLabels = ["January", "February", "March", "April", "May", "June", "July", 
						"August", "September", "October", "November", "December"];
	var xAxis = d3.axisBottom(xScale).tickFormat(function (d, i) { return xTickLabels[i] });
	var yTickLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", ">10"];
	var yAxisLeft = d3.axisLeft(yScale).tickFormat(function (d, i) { return yTickLabels[i] });
	var yAxisRight = d3.axisRight(yScale).tickFormat(function (d, i) { return yTickLabels[i] });

	/*** bump chart SVG ***/
    // use addSvgToHtml? --> will optimize code at the end
    var bumpChartGroup = d3.select("#bumpChartDiv")
        .append("svg")
		.attr("id", "bumpChartSvg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
        .append("g")
		.attr("id", "bumpChartGroup")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//console.log(bumpChartGroup);

	var completeBumpDataset = d3.csv("./data/bumpChartData.csv");

    d3.csv("./data/bumpChartData.csv").then(function (data) {
		var dataGlobal = data.filter(d => d.Region == "Global");
        addAxes(bumpChartGroup, xAxis, yAxisLeft, yAxisRight, height, margin.bottom);
		createBumpChart(bumpChartGroup, dataGlobal, xScale, yScale, height);
		var searchBarElement = setSearchBarParameters(data);
		setSearchHandler(bumpChartGroup, searchBarElement, data, xScale, yScale, height);
	});
	

})(d3, localization);
