"use strict";

/**
 * This file creates bump chart
 */

/**
 * Create chart axis
 *
 * @param g       
 * @param xAxis
 * @param yAxis 
 * @param height
 * @param width
 */
function createAxes(g, xAxis, yAxis, height, width) {
  // Axe horizontal

	var padding = 50;

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(40," + (height - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 10)
        .attr("dy", 12)
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
/*
	g.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height - 8)
		.text("put axis name here");
*/	
	g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(40,0)")
		.call(yAxis);
/*
	g.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", 0)
		.attr("y", 20)
		.attr("transform", function(d) {
			return "rotate(-90)"})
        .text("put axis name here");
*/
}