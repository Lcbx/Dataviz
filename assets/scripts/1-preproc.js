 "use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine en associant un nom de rue à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param data    Données provenant du fichier CSV.
 */
function domainColor(color, data) {
	// TODO: Définir le domaine de la variable "color" en associant un nom de rue à une couleur.
  var newColorRange = color.range();
  newColorRange[newColorRange.length - 1] = "#000000";
  color.range(newColorRange); 

	var rues = Object.keys(data[0]).slice(1);
	color.domain(rues);
}

/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 * @see https://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function parseDate(data) {
  // TODO: Convertir les dates du fichier CSV en objet de type Date.
  
  for(var i = 0; i<data.length; i++) {
  	var date = data[i].Date;
  	var dateArray = date.split("/");
  	var d = new Date(2016, dateArray[1]-1, dateArray[0]);
  	data[i].Date = d;
  }
  //console.log(data);
}

/**
 * Trie les données par nom de rue puis par date.
 *
 * @param color     Échelle de 10 couleurs (son domaine contient les noms de rues).
 * @param data      Données provenant du fichier CSV.
 *
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      name: string      // Le nom de la rue,
 *                      values: [         // Le tableau compte 365 entrées, pour les 365 jours de l'année.
 *                        date: Date,     // La date du jour.
 *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
 *                      ]
 *                    },
 *                     ...
 *                  ]
 */
function createSources(color, data) {
  // TODO: Retourner l'objet ayant le format demandé.
  var rues = color.domain();
  var length = rues.length;
  for(var i=0; i<length; i++){
  	var rue = rues[i];
  	var temp = [];
  	rues[i] = { "name" : rue, "values" : temp };

    data.map(function(d) {
      rues[i].values.push({ "date" : d.Date , "count" : parseInt(d[rue]) });
    })
  }
  //console.log(rues);
  return rues;
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param xContext    Échelle en X utilisée avec le graphique "contexte".
 * @param data        Données provenant du fichier CSV.
 */
function domainX(xFocus, xContext, data) {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  var dates = data.map(function(d){return d.Date});
  var maxDate = d3.max(dates);
  var minDate = d3.min(dates);
  xFocus.domain([minDate, maxDate]);
  xContext.domain([minDate, maxDate]);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param yContext    Échelle en Y utilisée avec le graphique "contexte".
 * @param sources     Données triées par nom de rue et par date (voir fonction "createSources").
 */
function domainY(yFocus, yContext, sources) {
  // TODO: Préciser les domaines pour les variables "yFocus" et "yContext" pour l'axe Y.
  var maxCount = 0;
  var minCount = 10000000;
  var counts = sources.map(function(d){
    var c = d.values.map(function(v){
      if (v.count > maxCount) maxCount = v.count;
      if (v.count < minCount) minCount = v.count;
      });
    });
  yFocus.domain([minCount, maxCount]);
  yContext.domain([minCount, maxCount]);
}
