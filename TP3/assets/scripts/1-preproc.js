"use strict";

/**
 * Fichier permettant de traiter les données provenant des fichiers CSV.
 */


/**
 * Initialise les données provenant des fichiers CSV en convertissant
 * les nombres au format "string" au format "number".
 *
 * @param data    Données provenant d'un fichier CSV.
 */
function initializeData(data) {
  // TODO: Convertir les propriétés "income", "lifeExpectancy" et "population" au format "number" pour chacune des entrées.

	for (let i=0; i<data.length; i++){
		data[i].income = parseFloat(data[i].income);
		data[i].lifeExpectancy = parseFloat(data[i].lifeExpectancy);
		data[i].population = parseInt(data[i].population);
	}
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe X du nuage de points.
 *
 * @param x     Échelle X à utiliser.
 */
function domainX(x) {
  // TODO: Préciser le domaine pour la variable "x" en prenant comme minimum et maximum les valeurs suivantes: 35 ans et 90 ans.

	var minDomainX = 35;
	var maxDomainX = 90;
	x.domain([minDomainX, maxDomainX]);
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe Y du nuage de points.
 *
 * @param y     Échelle Y à utiliser.
 */
function domainY(y) {
  // TODO: Préciser le domaine pour la variable "y" en prenant comme minimum et maximum les valeurs suivantes: 0 USD et 140000 USD.
	
	var minDomainY = 0;
	var maxDomainY = 14000;
	y.domain([minDomainY, maxDomainY]);
}

/**
 * Précise le domaine de l'échelle de couleurs qui est utilisée pour distinguer chacune des régions du monde.
 *
 * @param color   Échelle de couleurs.
 * @param data    Données provenant d'un fichier CSV.
 */
function domainColor(color, data) {
  // TODO: Préciser le domaine de l'échelle de couleurs. Assurez-vous d'associer une zone du monde distincte pour chaque couleur.
	
	var zones = data.map(function(d){ return d.zone;});
	color.domain = zones.filter(function(d,i,D){ return D.indexOf(d) === i});
}

/**
 * Précise le domaine de l'échelle du rayon des cercles qui est utilisée pour représenter la population des pays.
 *
 * @param r       Échelle du rayon des cercles (échelle racine carrée).
 * @param data    Données provenant d'un fichier CSV.
 */
function domainRadius(r, data) {
  // TODO: Préciser le domaine de l'échelle de la variable "r" em spécifiant comme valeurs extrêmes le minimum et le
  //       maximum des populations des pays.
  	var population = data.map(function(d){return d.population});
  	console.log(population);
	var minDomainR = d3.min(population);	
	var maxDomainR = d3.max(population);
	r.domain([minDomainR, maxDomainR]);
}
