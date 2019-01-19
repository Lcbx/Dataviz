"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
function createLine(x, y) {
  // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
  
  // SEE THIS : https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
  // AND THIS : http://www.d3noob.org/2016/08/create-simple-line-graph-using-d3js-v4.html
  // IT SHOULD FREAKING WORK --edit : it works now
  var line = d3.line()
    .x(function(d) { console.log(d.date); return x(d.date);  })
    .y(function(d) { console.log(d.count); return y(d.count); })
	.curve(d3.curveBasisOpen);
  return line;

}

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
  
  // YOU GIVING ME A HEARTSTROKE --edit : it works now
	g.append("path")
		.data([ sources[0]["values"] ]) // <= don't forget the [] around data
		.attr("class", "line")
		.attr("d", line)
		.attr("stroke", "#ffab00") // color
		.attr("clip-path", "url(0)"); // "url(#clip)"); idk
		
	console.log(sources[0]["values"]);
	return g;
}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".

}
