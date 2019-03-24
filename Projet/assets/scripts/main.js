/**
 *
 *
 *
 *
 */
(function(d3) {
    "use strict";

    d3.csv("./data/bumpChartData.csv").then(function(data) {
        //console.log(data)
    })

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    pairId = 0;

    var svg = d3.select("#bumpChartDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleOrdinal()
        .domain(["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"]);
        //.rangeBands([0, width], .5, 0);

    var xTangent = 40,
        yPadding = .3;

    var y = d3.scaleLinear()
        .range([0, height]);
        

  })(d3);