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


(function (d3, L, topojson, localization, searchBar) {
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
	var radarChartData;
	d3.json("./data/top1PerCountry.json").then(data => {
		// Radar chart setup
		radarChartData = data;
		const radarChartColor = createColorScale(radarChartData["global"]);
		drawData(radarChartGroup, radarChartData["global"], radarChartScale,
			radarChartColor, radarChartConfiguration.radius, radarChartAxes);
	});


	/***********/
	/*** Map ***/
	/***********/

	/***** Configuration *****/
	var panel = d3.select("#panel");
	var map = L.map('map', {
		'worldCopyJump': true
	});

	/***** Échelles utilisées *****/
	var color = d3.scaleLinear();

	/***** Chargement des données *****/
	var promises = [];
	promises.push(d3.json("./data/world_data.json"));
	promises.push(d3.csv("./data/world-country-names.csv"));
	var updateMapData;
	Promise.all(promises).then(function (results) {
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
		var path = createPath(map);

		createCountries(g, path, world, data, color, showPanel, data);
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

		/***** Gestion du panneau d'informations *****/
		panel.select("button")
			.on("click", function () {
				reset(g);
				panel.style("display", "none");
			});
		function showPanel(countryName) {
			var countryData = data.find(function (e) {
				if(countryName == e.id){
					return e.name;
				}
			});
			panel.style("display", "block");
			updatePanelInfo(panel, countryData, localization.getFormattedNumber);
		}

		updateMapData = function (countryName) {
			var id;
			var feature = world.features.find(function (d) {
				if (d.properties["NAME_LONG"] === countryName) {
					id = Number(d.properties["id"])
					return true;
				}
			});
			var bound = d3.geoBounds(feature);
			search(map, g, id, [
					[bound[0][1], bound[0][0]],
					[bound[1][1], bound[1][0]]
				], showPanel);
		}
	});

	/******************/
	/*** bump chart ***/
	/******************/

	// layout parameters
	var bumpChartMargin = { top: 20, right: 55, bottom: 70, left: 40 },
		bumpWidth = 900 - bumpChartMargin.left - bumpChartMargin.right,
		bumpHeight = 500 - bumpChartMargin.top - bumpChartMargin.bottom;

	// bump chart scales
	var xDomain = ["2017-01-01", "2017-02-01", "2017-03-01", "2017-04-01",
		"2017-05-01", "2017-06-01", "2017-07-01", "2017-08-01",
		"2017-09-01", "2017-10-01", "2017-11-01", "2017-12-01"];

	// scales creation
	var xScale = d3.scalePoint()
		.domain(xDomain)
		.range([0, bumpWidth]),
		yScale = d3.scaleLinear()
			.domain([1, 11])
			.range([0, bumpHeight]);

	// bump chart axes
	var xTickLabels = ["January", "February", "March", "April", "May", "June", "July",
		"August", "September", "October", "November", "December"];
	var xAxis = d3.axisBottom(xScale).tickFormat(function (d, i) { return xTickLabels[i] });
	var yTickLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", ">10"];
	var yAxisLeft = d3.axisLeft(yScale).tickFormat(function (d, i) { return yTickLabels[i] });
	var yAxisRight = d3.axisRight(yScale).tickFormat(function (d, i) { return yTickLabels[i] });

	// bump chart SVG
	var bumpChartGroup = d3.select("#bumpChartDiv")
		.append("svg")
		.attr("id", "bumpChartSvg")
		.attr("width", bumpWidth + bumpChartMargin.left + bumpChartMargin.right)
		.attr("height", bumpHeight + bumpChartMargin.top + bumpChartMargin.bottom)
		.append("g")
		.attr("id", "bumpChartGroup");

	// load data, create chart elements and set country search bar
	d3.csv("./data/bumpChartData.csv").then(function (data) {
		addAxes(data, bumpChartGroup, xAxis, yAxisLeft, yAxisRight, bumpWidth, bumpHeight, bumpChartMargin);
		createBumpChart(bumpChartGroup, data, "Global", xScale, yScale, bumpChartMargin);
		var searchBarElement = setSearchBarParameters(data);
		searchBarElement.search = (id, countryName) => {
			// Update bump chart
			bumpCharSearchHandler(countryName, bumpChartGroup, data, xScale, yScale, bumpChartMargin);
			// Update radar chart
			const radarChartColor = createColorScale(radarChartData[mapCountryNameCode[countryName]]);
			updateRadarChartData(radarChartGroup, radarChartData[mapCountryNameCode[countryName]], radarChartScale,
				radarChartColor, radarChartConfiguration.radius, radarChartAxes)
			// Update map
			updateMapData(countryName);
		};
	});


	/**
	 * Bar chart initialisation 
	 */
	const features = ["danceability", "energy", "speechiness", "acousticness", "instrumentalness", "liveness", "valence"];

	margin = { top: 40, right: 20, bottom: 20, left: 230 };
	width = 450 - margin.left - margin.right;
	height = 330 - margin.top - margin.bottom;

	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleBand().range([0, height]);

	d3.csv("./data/artists.csv").then(function (data) {
		data.forEach(function (d) {
			d.nTracks = +d.nTracks;
			d.danceability = +d.danceability;
			d.energy = +d.energy;
			d.speechiness = +d.speechiness;
			d.acousticness = +d.acousticness;
			d.instrumentalness = +d.instrumentalness;
			d.liveness = +d.liveness;
			d.valence = +d.valence;
		})

		features.forEach(function (feature) {
			var barChartGroup = d3.select("#" + feature + "chart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("id", "barchartGroup")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			data.sort((a, b) => (b[feature]) - a[feature]);
			var featureList = data.slice(0, 10);

			x.domain([0.,1.]);
			y.domain(featureList.map(d => d.name)).padding(0.3);

			barChartGroup.append("g")
				.attr("class", "x axis");

			barChartGroup.append("g")
				.style("font", "13px times")
				.attr("class", "y axis")
				.call(d3.axisLeft(y));

			var tooltip = d3.select("body").append("div").attr("class", "tooltip");

			barChartGroup.selectAll(".bar")
				.data(featureList)
				.enter().append("rect")
				.attr("class", "bar")
				.attr("fill", "steelblue")
				.attr("x", 2)
				.attr("height", y.bandwidth())
				.attr("y", d => y(d.name))
				.attr("width", d => x(d[feature]))
				.on("mousemove", function (d) {
					tooltip
						.style("left", d3.event.pageX - 5 + "px")
						.style("top", d3.event.pageY - 7 + "px")
						.style("display", "inline-block")
						.html(
							(d.name) + "<br>" +
							"danceability : " + (d.danceability.toPrecision(3)) + "<br>" +
							"energy : " + (d.energy.toPrecision(3)) + "<br>" +
							"speechiness : " + (d.speechiness.toPrecision(3)) + "<br>" +
							"acousticness : " + (d.acousticness.toPrecision(3)) + "<br>" +
							"instrumentalness : " + (d.instrumentalness.toPrecision(3)) + "<br>" +
							"liveness : " + (d.liveness.toPrecision(3)) + "<br>" +
							"valence : " + (d.valence.toPrecision(3))
						);
				})
				.on("mouseout", function (d) { tooltip.style("display", "none"); });

			barChartGroup.append("text")
				.attr("x", (width / 2))
				.attr("y", 0 - (margin.top / 3))
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.style("text-decoration", "underline")
				.text(feature);
		});
	});

})(d3, L, topojson, localization, searchBar);
