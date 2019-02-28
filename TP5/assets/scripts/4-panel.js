"use strict";

/**
 * Fichier permettant de gérer l'affichage du panneau d'informations pour une circonscription.
 */


/**
 * Met à jour les domaines X et Y utilisés par le diagramme à bandes horizontales lorsque les données sont modifiées.
 *
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 */
function updateDomains(districtSource, x, y) {
  /* TODO: Mettre à jour les domaines selon les spécifications suivantes:
       - Le domaine X varie entre le minimum et le maximum de votes obtenus pour les candidats de la circonscription;
       - Le domaine Y correspond au nom des partis politiques associés aux candidats qui se sont présentés. Assurez-vous
         que les partis sont triés en ordre décroissant de votes obtenus (le parti du candidat gagnant doit se retrouver
         en premier).
   */

    function compare(a,b) {
      if (a.votes > b.votes)
         return -1;
      if (a.votes < b.votes)
        return 1;
      return 0;
    }

    let results = districtSource.results;
    results.sort(compare);
    let votes = results.map(function(d){return d.votes;});
    x.domain([Math.min(...votes), Math.max(...votes)]);    
    let candidates = results.map(function(d){return d.party;});
    y.domain(candidates);
}

/**
 * Met à jour les informations textuelles se trouvant dans le panneau à partir des nouvelles données fournies.
 *
 * @param panel             L'élément D3 correspondant au panneau.
 * @param districtSource    Les données associées à une circonscription.
 * @param formatNumber      Fonction permettant de formater correctement des nombres.
 */
function updatePanelInfo(panel, districtSource, formatNumber) {
  /* TODO: Mettre à jour les informations textuelles suivantes:
       - Le nom de la circonscription ainsi que le numéro;
       - La nom du candidat gagnant ainsi que son parti;
       - Le nombre total de votes pour tous les candidats (utilisez la fonction "formatNumber" pour formater le nombre).
   */
    panel.select("#district-name").text(districtSource.name);
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

console.log(parties);
/*
    for (i=0; i<districtSource.results.length; i++) {
        for (j=0; j<parties.length; j++) {
            
        }
    }
*/
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
