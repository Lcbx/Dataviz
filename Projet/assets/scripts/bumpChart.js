"use strict";

/**
 * This file creates bump chart
 */

/**
 * Add axes to chart's svg group
 *
 * @param g         		Svg group where the bump chart should be created
 * @param xAxis     		horizontal axis
 * @param yAxis     		vertical axis
 * @param height    		chart height
 * @param bottomMargin 	chart bottom margin
 */
function addAxes(g, xAxis, yAxis, height, bottomMargin) {
  // Axe horizontal

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
        .attr("transform", "translate(10,0)")
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
			.attr("transform", "translate(10," + (height - 30) + ")")
			.selectAll("g")
			.data(data)
			.enter()
			.append("g");
			
	bump.append("path")
		.attr("class", "songPath")
		.attr("d", createPath);

	function createPath(d) {
		var heightFactor = (y.range()[1] - y.range()[0])/10;
		var path = [];
		var initialPos = 0;
		if (d[x.domain()[0]] == "") {
			initialPos = 11;
		} else {
			initialPos = d[x.domain()[0]];
		}
		//console.log(d["Track.Name"]);
		//console.log((initialPos-1)*heightFactor);
		
		x.domain().forEach(function(b, i) {
		var a = x.domain()[i];
		//console.log(d[b]);
		path.push("L", x(a), ",", y(d[a + "-offset"]), "h", x.bandwidth(), curve(a, b, d));
		});
		return path.join("");
	}

	function curve(a, b, d) {
		var xTangent = 10;
		return "C" + (x(a) + xTangent + x.bandwidth()) + "," + y(d[a + "-offset"]) + " "
				+ (x(b) - xTangent) + "," + y(d[b + "-offset"]) + " "
				+ x(b) + "," + y(d[b + "-offset"]);
	}

}
