"use strict";

/**
 * Fichier permettant de dessiner le diagramme à cordes.
 */


/**
 * Crée les groupes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param arc             Fonction permettant de dessiner les arcs.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://bl.ocks.org/mbostock/4062006
 */
function createGroups(g, data, layout, arc, color, total, formatPercent) {
  /* TODO:
     - Créer les groupes du diagramme qui sont associés aux stations de BIXI fournies.
     - Utiliser un "textPath" pour que les nom de stations suivent la forme des groupes.
     - Tronquer les noms des stations de BIXI qui sont trop longs (Pontiac et Métro Mont-Royal).
     - Afficher un élément "title" lorsqu'un groupe est survolé par la souris.
  */
  var destination = g.selectAll(".destination")
    .data(layout.groups)
    .enter()
    .append("g")
    .attr("class", "destination")

  destination.append("path")
    .attr("id", (d, i) => { return "destination" + i } )
    .attr("d", arc)
    .data(data) 
    .style("fill", d => { return color(d.name) } )
    .append("title").text(function(d) {
        var destinations = d.destinations;
        var nbDeparts = destinations.reduce(function(prev, cur) {return prev + cur.count;}, 0);              
        return d.name + ": " + formatPercent(nbDeparts/total) + " des départs";});

  destination.append("text")
    .attr("x", 8)
    .attr("dy", 18)
    .attr("font-size", 12.5)
    .append("textPath")
    .attr("pointer-events", "none")
    .data(data)
    .attr("xlink:href", (d, i) => { return "#destination" + i})
    .text(d => {
      if (d.name === "Pontiac / Gilford")
        return "Pontiac";

      else if (d.name === "Métro Mont-Royal (Rivard/Mont-Royal)")
        return "Métro Mont-Royal";
    
      else 
        return d.name;
    })
    .style("fill", "white");

}

/**
 * Crée les cordes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param path            Fonction permettant de dessiner les cordes.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://beta.observablehq.com/@mbostock/d3-chord-dependency-diagram
 */
function createChords(g, data, layout, path, color, total, formatPercent) {
  /* TODO:
     - Créer les cordes du diagramme avec une opacité de 80%.
     - Afficher un élément "title" lorsqu'une corde est survolée par la souris.
  */
  var ribbons = g.selectAll(".ribbons")
    .data(layout)
    .enter()
    .append("g")
    .attr("class", "ribbons")

  ribbons.append("path")
    .attr("opacity", 0.8)
    .attr("id", (d, i) => { return "ribbon" + i } )
    .attr("d", path)
    .attr("fill", d => { return color(data[d.source.index].name) });

}

/**
 * Initialise la logique qui doit être réalisée lorsqu'un groupe du diagramme est survolé par la souris.
 *
 * @param g     Le groupe SVG dans lequel le diagramme à cordes est dessiné.
 */
function initializeGroupsHovered(g) {
  /* TODO:
     - Lorsqu'un groupe est survolé par la souris, afficher les cordes entrant et sortant de ce groupe avec une
       opacité de 80%. Toutes les autres cordes doivent être affichées avec une opacité de 10%.
     - Rétablir l'affichage du diagramme par défaut lorsque la souris sort du cercle du diagramme.
  */
	g.selectAll(".ribbons")
		.on('mouseover', function(d){
			console.log(d);
			console.log(g.selectAll("path"));
			var index = d.source.index;
			g.selectAll("path")
				.attr("opacity", 0.4);
			g.selectAll("#destination" + index)
				.attr("opacity", 0.9);
			})
		.on('mouseout', function(d){
			g.selectAll("path")
				.attr("opacity", 0.8);
		});
}
