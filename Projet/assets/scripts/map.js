"use strict";

/**
 * Fichier permettant de gérer l'affichage de la carte.
 */


/**
 * Initialise le fond de carte qui doit être utilisé et la position d'affichage initial.
 *
 * @param L     Le contexte Leaflet.
 * @param map   La carte Leaflet.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initTileLayer(L, map) {
  /* TODO: Initialiser le "tileLayer" avec les propriétés suivantes:
       - URL du fond de carte: https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png;
       - Zoom maximum: 10;
       - Zoom minimum: 1.

     Régler l'affichage initial (view) de la carte aux valeurs suivantes:
       - Coordonnées: [57.3, -94.7];
       - Niveau de zoom: 4.
   */

   map.setView([57.3, -94.7], 3);

   L.tileLayer(" https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
    maxZoom: 10,
    minZoom: 1
   }).addTo(map);

}

/**
 * Initialise le contexte SVG qui devra être utilisé au-dessus de la carte Leaflet.
 *
 * @param map   La carte Leaflet.
 * @return      L'élément SVG créé.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initSvgLayer(map) {
  // TODO: Créer l'élément SVG en vous basant sur l'exemple fourni. Assurez-vous de créer un élément "g" dans l'élément SVG.
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    return svg
}

/**
 * Crée les tracés des circonscriptions sur le contexte SVG qui se trouve au-dessus de la carte Leaflet.
 *
 * @param g             Le groupe dans lequel les tracés des circonscriptions doivent être créés.
 * @param path          La fonction qui doit être utilisée pour tracer les entités géométriques selon la bonne projection.
 * @param canada        Les entités géographiques qui doivent être utilisées pour tracer les circonscriptions.
 * @param sources       Les données contenant les informations sur chacune des circonscriptions.
 * @param color         L'échelle de couleurs qui est associée à chacun des partis politiques.
 * @param showPanel     La fonction qui doit être appelée pour afficher le panneau d'informations.
 */
function createDistricts(g, path, world, sources, color, showPanel) {
  /* TODO: Créer les tracés des circonscriptions. Assurez-vous de respecter les spécifications suivantes:
       - La couleur de la circonscription doit correspondre à la couleur du parti du candidat gagnant;
       - L'opacité de la couleur (fill-opacity) doit être de 80%;
       - La couleur des traits doit être "#333";
       - Lorsqu'une circonscription est cliquée, celle-ci doit devenir sélectionnée (classe "selected") et le panneau
         d'informations associé à cette circonscription doit faire son apparition (utiliser la fonction "showPanel").
         Il est à noter qu'il est possible de sélectionner uniquement une circonscription à la fois.
   */
   
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
          console.log(d.properties.NAME);
          var selectedCountry = d.properties.NAME;
          g.selectAll(".country")
            .classed("selected", d => (d.properties.NAME == selectedCountry));
          showPanel(selectedCountry);
        });

}

/**
 * Met à jour la position et la taille de l'élément SVG, la position du groupe "g" et l'affichage des tracés lorsque
 * la position ou le zoom de la carte est modifié.
 *
 * @param svg       L'élément SVG qui est utilisé pour tracer les éléments au-dessus de la carte Leaflet.
 * @param g         Le groupe dans lequel les tracés des circonscriptions ont été créés.
 * @param path      La fonction qui doit être utilisée pour tracer les entités géométriques selon la bonne projection.
 * @param canada    Les entités géographiques qui doivent être utilisées pour tracer les circonscriptions.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function updateMap(svg, g, path, world) {
  // TODO: Mettre à jour l'élément SVG, la position du groupe "g" et l'affichage des tracés en vous basant sur l'exemple fourni.
  var countries = path.bounds(world);
  var topLeft = countries[0], bottomRight = countries[1];

  svg.attr("width", bottomRight[0] - topLeft[0])
     .attr("height", bottomRight[1] - topLeft[1])
     .style("left", topLeft[0] + "px")
     .style("top", topLeft[1] + "px");
  
  g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
      
  g.selectAll('path').attr("d", path);
}

function updatePanelInfo(panel, districtSource, formatNumber) {
  /* TODO: Mettre à jour les informations textuelles suivantes:
       - Le nom de la circonscription ainsi que le numéro;
       - La nom du candidat gagnant ainsi que son parti;
       - Le nombre total de votes pour tous les candidats (utilisez la fonction "formatNumber" pour formater le nombre).
   */

    panel.select("#district-name").text(districtSource.name + " [" + districtSource.id + "]");
    panel.select("#elected-candidate").text(districtSource.results[0].candidate + " ("+ districtSource.results[0].party + ")");
    let votesCount = 0;
    for (let i=0; i<districtSource.results.length; i++){
        votesCount += districtSource.results[i].votes;
    }
    panel.select("#votes-count").text(votesCount+ " votes");
}

/**
 * Met à jour le diagramme à bandes horizontales à partir des nouvelles données de la circonscription sélectionnée.
 *
 * @param gBars             Le groupe dans lequel les barres du graphique doivent être créées.
 * @param gAxis             Le groupe dans lequel l'axe des Y du graphique doit être créé.
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 * @param yAxis             L'axe des Y.
 * @param color             L'échelle de couleurs qui est associée à chacun des partis politiques.
 * @param parties           Les informations à utiliser sur les différents partis.
 *
 * @see https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
 */
function updatePanelBarChart(gBars, gAxis, districtSource, x, y, yAxis, color, parties) {
  /* TODO: Créer ou mettre à jour le graphique selon les spécifications suivantes:
       - Le nombre de votes des candidats doit être affiché en ordre décroissant;
       - Le pourcentage obtenu par chacun des candidat doit être affiché à droite de le barre;
       - La couleur de la barre doit correspondre à la couleur du parti du candidat. Si le parti du candidat n'est pas
         dans le domaine de l'échelle de couleurs, la barre doit être coloriée en gris;
       - Le nom des partis doit être affiché sous la forme abrégée. Il est possible d'obtenir la forme abrégée d'un parti
         via la liste "parties" passée en paramètre. Il est à noter que si le parti ne se trouve pas dans la liste "parties",
         vous devez indiquer "Autre" comme forme abrégée.
   */

    let abbreviates = parties.map(d => d.abbreviation);
    let partiesNames = parties.map(d => d.name);
    let axisNames = [];
    
    for (let i=0; i<districtSource.results.length; i++) {
        let pos = partiesNames.indexOf(districtSource.results[i].party);
        if(pos > -1){
            axisNames[i] = abbreviates[pos];
        } else {
            axisNames[i] = "Autre";
        }
    }

        gBars.selectAll("rect").remove();

        gBars.selectAll("rect")
         .data(districtSource.results)
         .enter()
         .append("rect")
         .attr("class","bar")
         .attr("x", 0)
         .attr("y", d => y(d.candidate))
         .attr("width", d => x(d.votes))
         .attr("height", y.bandwidth())
         .attr("fill", d => color.domain().includes(d.party) ? color(d.party) : "grey");

        gBars.selectAll("text").remove();
        gBars.selectAll("text")
            .data(districtSource.results)
            .enter()
            .append("text")
            .text(d => d.percent)
            .attr("x", d => x(d.votes)+5)
            .attr("y", d => y(d.candidate)+ y.bandwidth()/2 + 5);

    yAxis.tickFormat(function(d, i){return axisNames[i];});
    gAxis.selectAll("g").remove();
    gAxis.append("g").call(yAxis);

}

/**
 * Réinitialise l'affichage de la carte lorsque la panneau d'informations est fermé.
 *
 * @param g     Le groupe dans lequel les tracés des circonscriptions ont été créés.
 */
function reset(g) {
  // TODO: Réinitialiser l'affichage de la carte en retirant la classe "selected" de tous les éléments.
    g.select(".selected").attr("class", "circonscription");
}