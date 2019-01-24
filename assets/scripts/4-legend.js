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
    var legend = svg.append("g")
      .attr("class", "legend")
    
    legend.selectAll("rect")
      .data(sources)
      .enter()
      .append("rect")
      .attr("width",10)
      .attr("height",10)
      .attr("x",70)
      .attr("y",function (d,i) {return 30+30*i})
      .attr("fill", function (d) { return color(d.name) })
      .attr("stroke","black")
      .on("click", function(d) {
        var couleur = d3.select(this).attr("fill");
        d3.select(this)
          .attr("fill", couleur == "white" ? color(d.name) : "white");
        displayLine(d.name, couleur);
      });

    legend.selectAll("text")
      .data(sources)
      .enter()
      .append("text")
      .attr("x",85)
      .attr("y", function(d,i) {return 40+30*i})
      .attr("font-size",10)
      .attr("fill", function (d) { return color(d.name) })
      .text(function(d) {return d.name})
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
  	d3.selectAll("#"+ element).style("opacity", color == "white" ? 1 : 0 );

}
