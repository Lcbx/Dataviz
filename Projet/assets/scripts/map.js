/**
 * Fichier principal permettant de gérer la carte.
 */

(function (L, d3, topojson, searchBar, localization) {
  "use strict";

  /***** Configuration *****/
  var panel = d3.select("#panel");
  var map = L.map('map', {
    'worldCopyJump': true
  });

  var barChartMargin = {
    top: 0,
    right: 40,
    bottom: 0,
    left: 40
  };
  var barChartWidth = 300 - barChartMargin.left - barChartMargin.right;
  var barChartHeight = 150 - barChartMargin.top - barChartMargin.bottom;

  /***** Échelles utilisées *****/
  var color = d3.scaleLinear();
  var x = d3.scaleLinear().range([0, barChartWidth]);
  var y = d3.scaleBand().range([0, barChartHeight]).padding(0.1);

  var yAxis = d3.axisLeft(y);

  /***** Création des éléments du diagramme à barres *****/
  var barChartSvg = panel.select("svg")
    .attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
    .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

  var barChartGroup = barChartSvg.append("g")
    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");

  var barChartBarsGroup = barChartGroup.append("g");
  var barChartAxisGroup = barChartGroup.append("g")
    .attr("class", "axis y");

  /***** Chargement des données *****/
  var promises = [];
  promises.push(d3.json("./data/world_data.json"));
  promises.push(d3.csv("./data/world-country-names.csv"));

  Promise.all(promises)
    .then(function (results) {
      var worldTopoJson = results[0];

      var world = topojson.feature(worldTopoJson, worldTopoJson.objects.ne_50m_admin_0_countries);
      var data = results[1];
      colorScale(color, data);

      /***** Initialisation de la carte *****/
      initTileLayer(L, map);
      var mapSvg = initSvgLayer(map);
	    var g = undefined;
	    
      if (mapSvg) {
		    g = mapSvg.select("g");
	    }
      var path = createPath();

      createCountries(g, path, world, data, color, showPanel);
      map.on("viewreset", function () {
        updateMap(mapSvg, g, path, world);
      });
      updateMap(mapSvg, g, path, world);

      /***** Recherche d'une circonscription *****/
      var autoCompleteSources = d3.nest()
        .key(function (d) {
          return d.id;
        })
        .entries(data)
        .map(function (d) {
          return {
            id: +d.values[0].id,
            name: d.values[0].name
          };
        })
        .sort(function (a, b) {
          return d3.ascending(a.name, b.name);
        });

      var searchBarElement = searchBar(autoCompleteSources);
      searchBarElement.search = function (id) {
        var feature = world.features.find(function (d) {  
          return Number(d.properties["id"]) === id;
        });
        var bound = d3.geoBounds(feature);

        search(map, g, id, [
          [bound[0][1], bound[0][0]],
          [bound[1][1], bound[1][0]]
        ], showPanel);
      };

      /***** Gestion du panneau d'informations *****/
      panel.select("button")
        .on("click", function () {
          reset(g);
          panel.style("display", "none");
        });

      
      function showPanel(countryName) {
        var countryData = data.find(function (e) {
          return countryName === e.name;
        });

        panel.style("display", "block");
        updatePanelInfo(panel, countryData, localization.getFormattedNumber);
      }
    });


  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function createPath() {
    var transform = d3.geoTransform({point: projectPoint});
    return d3.geoPath().projection(transform);
  }


  function colorScale(color, data) {
    var ratios = data.map( d => d.ratioEcoute);
    var maxRatio = d3.max(ratios);
    var minRatio = d3.min(ratios);

    var domain = [minRatio, maxRatio];
    var range =  ['#FFFFFF', '#F20E0E'];

    color.domain(domain);
    color.range(range);
  }

  function initTileLayer(L, map) {

   map.setView([57.3, -94.7], 3);

   L.tileLayer(" https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
    maxZoom: 10,
    minZoom: 1
   }).addTo(map);

}

function initSvgLayer(map) {
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    return svg
}

function createCountries(g, path, world, sources, color, showPanel) {
   
    for(var i = 0; i < sources.length; i++){
        var countryName = sources[i].name;
        var country = world.features.find(x => x.properties.NAME === countryName);
        if (country){
          country.properties.id = sources[i].id;
          country.properties.spotify = sources[i].spotify;
          country.properties.ratioEcoute = sources[i].ratioEcoute;
        }
    }

    var countries = g.selectAll('path')
        .data(world.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', "country")
        .attr('id', d => d.properties.NAME)
        .attr('fill', d => d.properties.spotify === "1" ? color(d.properties.ratioEcoute) : "black")
        .attr('fill-opacity', d => d.properties.spotify === "1" ? 0.7 : 1.0)
        .attr('stroke', '#333333')
        .on('click', d => {
          var selectedCountry = d.properties.NAME;
          g.selectAll(".country")
            .classed("selected", d => (d.properties.NAME == selectedCountry));
          showPanel(selectedCountry);
        });

}

  function search(map, g, countryId, bound, showPanel) {
    map.fitBounds(bound, {animate: true, pan: {animate: true, duration: 1, easeLinearity: 0.5}, maxZoom : 8});
    g.selectAll(".country").classed("selected", d => {
      return (d.properties.id == countryId)
    });
    showPanel(countryId);
  }

  function updatePanelInfo(panel, countryData, formatNumber) {
    panel.select("#country-name").text(countryData.name);

    var values = Object.values(countryData);
    var compteur = 0;
    for (var i = 8; i <= values.length; i+=2) {
      var position = i - (7 + compteur);
      panel.select("#top"+ position).text(position + ". " + values[i]);
      compteur++;
    }

    let songCount = Math.trunc(countryData.ratioEcoute * countryData.population);
    panel.select("#song-count").text(songCount+ " écoutes annuelles totales");
  }

  function updateMap(svg, g, path, countriesData) {
    var countries = path.bounds(countriesData);
    var topLeft = countries[0], bottomRight = countries[1];

    svg.attr("width", bottomRight[0] - topLeft[0])
       .attr("height", bottomRight[1] - topLeft[1])
       .style("left", topLeft[0] + "px")
       .style("top", topLeft[1] + "px");
    
    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        
    g.selectAll('path').attr("d", path);
  }



})(L, d3, topojson, searchBar, localization);
