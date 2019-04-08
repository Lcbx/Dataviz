/**
 * Fichier principal permettant de gérer la carte.
 */

function createPath(map) {
	var transform = d3.geoTransform({ point: function(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}});
	return d3.geoPath().projection(transform);
}


function colorScale(color, data) {
	var ratios = data.map(d => d.ratioEcoute);
	var maxRatio = d3.max(ratios);
	var minRatio = d3.min(ratios);

	var domain = [minRatio, maxRatio];
	var range = ['#FFFFFF', '#F20E0E'];

	color.domain(domain);
	color.range(range);
}

function initTileLayer(L, map) {
	map.setView([57.3, 0.0], 2);
	L.tileLayer(" https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
		maxZoom: 10,
		minZoom: 1
	}).addTo(map);
}

function initSvgLayer(map) {
	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");

	return svg;
}

function createCountries(g, path, world, sources, color, showPanel, data) {
	for (var i = 0; i < sources.length; i++) {
		var countryName = sources[i].name;
		var country = world.features.find(x => x.properties.NAME === countryName);
		if (country) {
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
			var selectedCountry = d.properties.id;
			g.selectAll(".country")
				.classed("selected", d => (d.properties.id == selectedCountry));
			showPanel(selectedCountry);
		});
	var linear = d3.scaleLinear()
		.domain([0, 1])
		.range(["rgb(255, 255, 255)", "rgb(242,14,14)"]);

	var svg = d3.select("svg");

	svg.append("g")
		.attr("class", "legendLinear")
		.attr("transform", "translate(20, 440)");

	var legendLinear = d3.legendColor()
		.title("Popularity")
		.shapeWidth(30)
		.orient('horizontal')
		.scale(linear);

	svg.select(".legendLinear")
		.call(legendLinear);
}

function search(map, g, countryId, bound, showPanel) {
	map.fitBounds(bound, { animate: true, pan: { animate: true, duration: 1, easeLinearity: 0.5 }, maxZoom: 8 });
	g.selectAll(".country").classed("selected", d => {
		return (d.properties.id == countryId)
	});
	showPanel(countryId);
}

function updatePanelInfo(panel, countryData, formatNumber) {
	panel.select("#country-name").text(countryData.name);

	var values = Object.values(countryData);
	var compteur = 0;
	for (var i = 8; i <= values.length; i += 2) {
		var position = i - (7 + compteur);
		panel.select("#top" + position).text(position + ". " + values[i]);
		compteur++;
	}
	let songCount = Math.trunc(countryData.ratioEcoute * countryData.population);
	panel.select("#song-count").text(songCount + " écoutes annuelles totales");
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

function reset(g) {
	g.select(".selected").attr("class", "circonscription");
}
