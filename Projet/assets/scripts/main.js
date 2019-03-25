/**
 *
 *
 *
 *
 */
(function(d3) {
    "use strict";

    d3.csv("./data/bumpChartData_global.csv").then(function(data) {
        console.log(data)
    })

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    pairId = 0;

    /*** bump chart scales ***/

    var xScale = d3.scaleTime()
        .domain([new Date(2017,0,1), new Date(2017,11,1)])
        .rangeRound([0, width - margin.right - 50]);

    var yScale = d3.scaleLinear()
    .domain([1, 11])
    .range([0, height - 50]);

    /*** bump chart SVG ***/
    var bumpChartGroup = d3.select("#bumpChartDiv").append("svg")
        .attr("id", "bumpChartSvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B"));

    var tickLabels = ["1","2","3","4","5","6","7","8","9","10",">10"];
    var yAxis = d3.axisLeft(yScale).tickFormat(function(d,i){ return tickLabels[i] });

    createAxes(bumpChartGroup, xAxis, yAxis, height, width);

    var xTangent = 40,
        yPadding = .3;


        

  })(d3);