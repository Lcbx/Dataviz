"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de rue et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.
  var legendRectSize = 18;
  var legendSpacing = 4;  

  var legend = svg.selectAll(".legend")
  	.data(color.domain())
  	.enter()
  	.append("g")
  	.attr("class", "legend")
  	.attr('transform', function(d, i) {
        var height = legendRectSize + 2*legendSpacing;
        var horz = 4 * legendRectSize;
        var vert = i * height + 10;
        return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('rect')
    	.attr("width", legendRectSize)
    	.attr("height", legendRectSize)
		.style('fill', color)
        .style('stroke', "black")
        .on("click", function(d, color) {
        	displayLine(d, color);
        });         

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; }); 
}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  	console.log(element);
  	
}
