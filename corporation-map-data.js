// Provisional corpus: placements are approximate and source pages remain inaccessible.
// Influence polygons are campaign proposals, never territorial ownership claims.
import {corporations} from './corporations.js';
import {districts} from './night-city-data.js';
const area=(name,points)=>({name,points});
const zones={
cityCenter:area('Centre-ville (City Center)',districts.find(d=>d.id==='city-center').shape),
southWatson:area('Sud de Watson','296,263 355,234 393,234 394,316 415,313 408,329 316,329'),
arasakaEstate:area('Domaine Arasaka / North Oak','558,229 604,226 619,244 612,272 597,285 574,279 556,258'),
santoDomingo:area('Santo Domingo',districts.find(d=>d.id==='santo-domingo').shape),
plaza:area('Corpo Plaza','349,351 404,347 430,369 417,400 402,402 396,426 371,437 354,423 346,395'),
downtown:area('Downtown','261,344 315,331 349,351 346,395 354,408 265,405 252,377'),
waterfront:area('Arasaka Waterfront','222,153 282,114 303,141 300,165 322,166 349,222 355,234 296,263 212,239'),
northside:area('Northside','282,114 330,112 353,83 407,62 448,67 466,82 484,128 506,179 475,212 437,224 425,197 404,209 389,207 355,234 349,222 322,166 300,165 303,141'),
charter:area('Charter Hill','488,350 515,373 555,379 557,380 588,412 596,453 544,458 503,439 473,416'),
arroyo:area('Arroyo','473,416 503,439 544,458 515,500 488,550 455,564 422,583 403,551 389,547 389,533 421,493'),
vista:area('Vista del Rey','400,436 420,419 440,408 473,416 452,448 421,493 402,488'),
farms:area('Biotechnica Flats','275,880 422,660 555,668 520,826 480,905 350,915'),
east:area('Corridors énergétiques des Badlands','640,415 820,385 907,454 884,579 688,598 641,560'),
petro:area('Périphérie industrielle de Rancho Coronado','520,495 598,480 602,540 585,578 568,605 483,614 455,592 484,550')};
const site=(id,name,district,x,y,kind,area,text,page)=>({id,name,district,x,y,kind,area,text,category:'Corporation',source:'https://cyberpunk.fandom.com/wiki/'+page,provisional:true});
const entries={
arasaka:{hq:'QG mondial : Tokyo, Japon. Direction locale : tour Arasaka, Corpo Plaza.',zones:[zones.cityCenter,zones.waterfront,zones.northside,zones.southWatson,zones.arasakaEstate,zones.santoDomingo],sites:[
site('corp-arasaka-hq','Tour Arasaka','city-center',373,378,'hq','Corpo Plaza','Direction locale d’Arasaka. Ce repère désigne le centre des activités à Night City, pas le siège mondial situé à Tokyo.','Arasaka_Tower'),
site('corp-arasaka-waterfront','Arasaka Waterfront','watson',269,216,'site','Arasaka Waterfront','Secteur portuaire et industriel associé à Arasaka. Le repère représente un ensemble d’installations, pas une entrée précise.','Arasaka_Waterfront'),
site('corp-arasaka-park','Parc industriel Arasaka','santo-domingo',466,487,'site','Arroyo','Complexe industriel d’Arasaka impliqué dans les événements de 2077. Emplacement dessiné approximativement.','Arasaka_Industrial_Park'),
site('corp-arasaka-konpeki','Konpeki Plaza','watson',329,211,'site','Arasaka Waterfront','Hôtel associé aux activités et aux événements d’Arasaka. Il s’agit d’un lieu lié à la corporation, sans assimiler tous ses visiteurs à ses employés.','Konpeki_Plaza'),
site('corp-arasaka-estate','Domaine Arasaka','westbrook',582,261,'site','North Oak','Résidence de la famille Arasaka à North Oak, liée notamment à Hanako dans les événements de 2077. Implantation ajoutée à partir de connaissances de l’univers, page et position encore à vérifier.','Arasaka_Estate'),
site('corp-arasaka-ebunike','Ebunike — lien avec Adam Smasher','watson',344,139,'site','Docks de Northside','Navire et zone de docks liés à Grayson et Adam Smasher. Le rattachement est personnel et opérationnel : il ne prouve pas une propriété directe d’Arasaka sur tout le site. Page et position encore à vérifier.','Ebunike')]},
militech:{hq:'QG mondial : Washington, NUSA. Une implantation de Night City est indiquée à Corpo Plaza, à vérifier.',zones:[zones.plaza,zones.arroyo,zones.east],sites:[
site('corp-militech-office','Bureaux Militech','city-center',395,367,'site','Corpo Plaza','Implantation corporatiste de Night City. Le positionnement sur la place reste à vérifier ; ce n’est pas le QG mondial.','Militech'),
site('corp-militech-base','Installation Militech des Badlands','badlands',710,461,'site','Badlands','Repère indicatif d’une présence militaire dans les Badlands. Il ne représente pas un relevé exact d’une base ni la maîtrise de tout le désert.','Militech'),
site('corp-militech-cynosure','Installation Cynosure','pacifica',411,625,'site','Sous-sol de la zone de Dogtown','Ancienne installation du projet Cynosure de Militech. Spoilers Phantom Liberty : ce complexe souterrain intervient dans une branche du récit. Son accès exact et sa projection sur le plan de surface restent à vérifier.','Cynosure_Facility')]},
'kang-tao':{hq:'QG mondial : Chine. La tour de Night City est une implantation locale, pas le siège mondial.',zones:[zones.plaza],sites:[
site('corp-kang-tao-tower','Tour Kang Tao','city-center',388,397,'site','Corpo Plaza','Tour associée à Kang Tao au sein du quartier corporatiste. Position précise à vérifier.','Kang_Tao')]},
biotechnica:{hq:'QG mondial : Italie. À Night City : tour corporatiste et installations agricoles périphériques.',zones:[zones.plaza,zones.farms],sites:[
site('corp-biotechnica-tower','Tour Biotechnica','city-center',360,404,'site','Corpo Plaza','Implantation de Biotechnica dans le centre corporatiste. Repère local distinct de son siège international.','Biotechnica'),
site('corp-biotechnica-flats','Biotechnica Flats','badlands',447,774,'site','Badlands du sud','Ensemble de serres et d’installations agricoles associé à Biotechnica. Le repère désigne la zone, pas un laboratoire individuel.','Biotechnica_Flats')]},
petrochem:{hq:'Le QG mondial n’est pas positionné sur ce plan. Les repères montrent des implantations locales à vérifier.',zones:[zones.plaza,zones.petro],sites:[
site('corp-petrochem-tower','Tour Petrochem','city-center',351,370,'site','Corpo Plaza','Implantation corporatiste de Petrochem à Night City. Emplacement exact à vérifier sur le plan de référence.','Petrochem'),
site('corp-petrochem-industry','Installations Petrochem','santo-domingo',546,568,'site','Rancho Coronado / périphérie','Repère industriel provisoire pour la campagne. Le rattachement de ce point précis à Petrochem n’a pas été vérifié.','Petrochem')]},
sovoil:{hq:'QG mondial : Moscou. Aucun QG local ni site précis confirmé dans les données disponibles.',zones:[zones.east],sites:[]},
 'trauma-team':{hq:'Aucun QG précis n’est positionné faute de vérification. Le service intervient dans la ville selon les contrats.',zones:[],sites:[]},
'night-corp':{hq:'Corporation implantée à Night City. Aucun bâtiment de direction n’est positionné faute de vérification.',zones:[zones.downtown],sites:[]},
zetatech:{hq:'Origine et siège historique : Cupertino. Le bâtiment de Heywood est une implantation locale à vérifier.',zones:[zones.vista],sites:[
site('corp-zetatech-building','Bâtiment Zetatech','heywood',418,450,'site','Vista del Rey','Implantation de Zetatech dans Heywood. Le repère ne désigne pas le siège mondial.','Zetatech')]},
kiroshi:{hq:'Corporation japonaise. Le site de Charter Hill est une implantation locale à vérifier.',zones:[zones.charter],sites:[
site('corp-kiroshi-building','Bâtiment Kiroshi','westbrook',544,418,'site','Charter Hill','Site associé à la cyberoptique Kiroshi. La position exacte et la fonction précise du bâtiment restent à vérifier.','Kiroshi')]} 
};
export const corporationLayers=corporations.map(c=>({...entries[c.id],id:c.id,name:c.name,color:c.color,logo:c.logo}));
