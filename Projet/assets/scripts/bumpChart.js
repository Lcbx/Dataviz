"use strict";

/**
 * This file creates bump chart
 */

/**
 * Add axes to chart's svg group
 *
 * @param g         		Svg group where the bump chart should be created
 * @param xAxis     		horizontal axis
 * @param yAxisLeft     	left vertical axis
 * @param yAxisRight     	right vertical axis
 * @param height    		chart height
 * @param bottomMargin 	chart bottom margin
 */
function addAxes(g, xAxis, yAxisLeft, yAxisRight, height, bottomMargin) {

	var padding = 0;

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(10," + (height - bottomMargin) + ")")
		.call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 10)
        .attr("dy", 12)
        .attr("transform", "rotate(45)")
		.style("text-anchor", "start")
		.style("font-size", "12px");
				
	// TODO: change hard coded translate distance for parameters 
	g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(10,0)")
		.call(yAxisLeft)
		.style("font-size", "14px");

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(830,0)")
		.call(yAxisRight)
		.style("font-size", "14px");

/*  // add axis labels ?
	g.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", 0)
		.attr("y", 20)
		.attr("transform", function(d) {
			return "rotate(-90)"})
		.text("put axis name here");

	g.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height - 8)
		.text("put axis name here");
*/
}

/**
 * Create bump chart paths
 *
 * @param g     	Svg group where the bump chart should be created
 * @param data  	complete dataset used to create chart
 * @param x     	horizontal axis scale
 * @param y     	vertical axis scale
 * @param height	chart height
 */
function createBumpChart(g, data, x, y, height) {

	var bump = g.append("g")
			.attr("id", "bump")
			.attr("transform", "translate(10,0)")
			.selectAll("g")
			.data(data)
			.enter()
			.append("g");

	// create song paths displayed on the "default" view
	bump.append("path")
	.attr("class", "defaultSongPath")
	.attr("fill", "none")
	.attr("stroke", createColor)
	.attr("stroke-width", "1")
	.attr("d", createPath);

	// create wider song paths over default paths for a better mouse hover event management
	bump.append("path")
		.attr("class", "frontSongPath")
		.attr("stroke", createColor)
		.attr("fill", "none")
		.attr("d", createPath)
		.attr("stroke-width", "20")
		.attr("stroke-opacity", "0")
		.on("mouseover", function(d){selectPath(this); hideDefaultPaths();})							
		.on("mouseout", function(d){unselectPath(this); showDefaultPaths();});

	// make selected path appear on front	
	function selectPath(path) {
		d3.select(path)
			.attr("stroke-width", "8")
			.attr("stroke-opacity", "1");
		d3.select(path.parentNode).raise();
	}

	function unselectPath(path) {
		d3.select(path)
			.attr("stroke-opacity", "0")
			.attr("stroke-width", "20");
	}

	function hideDefaultPaths(){
		d3.selectAll(".defaultSongPath")
			.attr("stroke-opacity", "0.3");
	}

	function showDefaultPaths(){
		d3.selectAll(".defaultSongPath")
			.attr("stroke-opacity", "1");
	}

	// generate random color based on song id
	function createColor(d, i) {
		var randomNum = (d.songId.charCodeAt(0)+
							d.songId.charCodeAt(5)+
							d.songId.charCodeAt(10))%100;
		return d3.interpolateRainbow(randomNum/100);
	}

	//create a song path
	function createPath(d) {
		var heightFactor = (y.range()[1] - y.range()[0])/10;
		var path = [];
		var initialRank = 0;
		if (d[x.domain()[0]] == "") {
			initialRank = 11;
		} else {
			initialRank = d[x.domain()[0]];
		}
		path.push("M", 0, " ", y(initialRank));
		x.domain().slice(1).forEach(function(b, i) {
		var rank = 0;
		if (d[b] == "") {
			rank = 11;
		} else {
			rank = d[b];
		}
		var prevRank = 0;
		if (d[x.domain()[i]] == "") {
			prevRank = 11;
		} else {
			prevRank = d[x.domain()[i]];
		}
		var cpXPosition = x(b)-(x(b)-x(x.domain()[i]))/2;
		var prevYValue = y(prevRank);
		// Adding curves to chart
		path.push(" C ", cpXPosition, " ", prevYValue, ", ", cpXPosition,
					" ", y(rank), ", ", x(b), " ", y(rank));
		});
		path = path.join("");
		return path;
	}
}

/**
 * Set search bar parameters
 * 
 * @param data  	complete dataset used to create chart
 */
function setSearchBarParameters(data) {
	var autoCompleteSources = d3.nest()
	.key(function (d) {
	  return d.Region;
	})
	.entries(data)
	.map(function (d) {
	  return {
		id: +d.values[0].Region,
		name: d.values[0].Region
	  };
	})
	.sort(function (a, b) {
	  return d3.ascending(a.name, b.name);
	});
	var searchBarElement = searchBar(autoCompleteSources, "bump-search-bar");
	return searchBarElement;
}

/**
 * Set update chart handler when another country is selected
 * 
 * @param countryName  	name of the country to display
 * @param data  		complete dataset used to create chart
 */
function setSearchHandler(bumpChartGroup, searchBarElement, data, xScale, yScale, height) {
	searchBarElement.search = function(id, countryName){
		var countryData = data.filter(d => d.Region == countryName);
		d3.select("#bump").remove();
		createBumpChart(bumpChartGroup, countryData, xScale, yScale, height);
	}
}