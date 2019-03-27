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
 * @param data  	data used to create chart
 * @param x     	horizontal axis scale
 * @param y     	vertical axis scale
 * @param height	chart height
 */
function createBumpChart(g, data, x, y, height) {
	var bump = g.append("g")
			.attr("class", "bump")
			.attr("transform", "translate(10,0)")
			.selectAll("g")
			.data(data)
			.enter()
			.append("g");

	// TODO: display interactively song info on line hover
	bump.append("path")
		.attr("class", "songPath")
		.attr("stroke", createColor)
		.attr("stroke-width", "1")
		.attr("fill", "none")
		.attr("d", createPath)
		.on("mouseover", function(){d3.select(this).attr("stroke-width", "5");
									d3.select(this.parentNode).raise();})									
		.on("mouseout", function(d){d3.select(this).attr("stroke-width", "1");});

	// TODO: use fixed colors instead of random ?
	function createColor(d, i) {
		return d3.interpolateRainbow(Math.random());
	}

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
		path.push(" C ", cpXPosition, " ", prevYValue, ", ", cpXPosition,
					" ", y(rank), ", ", x(b), " ", y(rank));
		});
		path = path.join("");
		return path;
	}
}
