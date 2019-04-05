/**
 * Fichier principal permettant de générer le graph de chaleurs
*/
var dataset;
var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
features = ["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duration"]

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 90},
  width = 800 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
  .attr("id", "svg-heatmap")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(months)
  .padding(0.05);
svg.append("g")
  .attr("z-index", -1)
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(features)
  .padding(0.01);
svg.append("g")
  .attr("z-index", -1)
  .call(d3.axisLeft(y));

// Build color scale
var colors = d3.scaleLinear()
	.range(["#e8f8ed", "#1db954"])
  	.domain([0,100]);

// Define the div for the tooltip
var div = d3.select("#heatmap").append("div")	
    .attr("class", "tooltip")			
    .style("opacity", 0);

/***** Chargement des données *****/
var promises = [];
promises.push(d3.csv("./data/heatmapData.csv"));

Promise.all(promises)
    .then(function (results) {

    	svg.selectAll()
	      .data(results[0], (d) => { return d})
	      .enter()
	      .append("rect")
	      .attr("x", function(d) { return x(d.month) })
	      .attr("y", function(d) { return y(d.feature) })
	      .attr("width", x.bandwidth() )
      	  .attr("height", y.bandwidth() ) 	  
  		  .attr("z-index", -1)
	      .style("fill", function(d) { return colors(d.value) } )
	      .on("mouseover", function(d) {
	      	div.transition()
	      		.duration(200)
	      		.style("opacity", 0.9);
	      	div	.html(d.month.toUpperCase() + "<br/>" + d.feature.toUpperCase() + ": " + d.value/100)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY) + "px");	
	      })
    	  .on("mouseout", function(d) {
    	  	div.transition()		
                .duration(500)		
                .style("opacity", 0);	
    	  })
})

svg.append("g")
	.attr("class", "legendLinear")
	.style("font-size","10px")
	.attr("transform", "translate(250, -40)");

var legendLinear = d3.legendColor()
	.shapeWidth(30)
	.orient('horizontal')
	.scale(colors);

svg.select(".legendLinear")
	.call(legendLinear);