# AGENT — Night City

Prototype d’Agent personnel pour une campagne de JDR Cyberpunk avec règles maison. Interface française responsive : tableau de bord, communications locales, contrats, fiche avec six caractéristiques renommables, points de vie, eurodollars et notes/inventaire.

## Développement

Node.js 22.12+ (validé avec Node 24).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev
```

Production : `npm run build`, puis héberger le dossier `dist` sur un hébergement statique HTTPS. `npm run preview` permet de vérifier la compilation localement.

## Portée actuelle

Données de démonstration enregistrées dans le localStorage du navigateur. Aucun compte, serveur, synchronisation ou véritable envoi de messages. Ne pas y stocker de données sensibles. Effacer les données du site réinitialise la démo.

Le manifeste et le service worker préparent l’installation mobile sur navigateur compatible, via HTTPS. Le cache permet de réouvrir les ressources déjà consultées hors ligne. Installation mobile et fonctionnement hors ligne sur appareil réel restent à vérifier. Les polices Google sont facultatives et disposent de polices de repli.

Pour le jeu partagé : prévoir authentification, campagnes et rôles MJ/joueur, base de données avec contrôle des accès et messagerie temps réel. Les règles maison détaillées restent à définir avant d’automatiser les calculs.

## Vérification effectuée

Compilation Vite et parcours automatisé Chromium : accueil, modification et persistance du nom après rechargement, ajout d’un message local, contrat terminé/réactivable, viewport mobile de 390 pixels sans débordement horizontal et absence d’erreur JavaScript.

## GitHub Pages

Le build cible `/CyberpunkApp/`. La branche `gh-pages` contient les fichiers statiques compilés. Dans GitHub → Settings → Pages, choisir « Deploy from a branch », branche `gh-pages`, dossier `/ (root)`.

Pour republier après une modification : exécuter `npm ci` puis `npm run build`, et publier le contenu de `dist` à la racine de `gh-pages` (avec un fichier `.nojekyll`). Ne pas pousser les dépendances `node_modules`.

## Profils locaux

L’écran d’entrée propose MJ, J1 et J2, sans mot de passe. J1 et J2 disposent de données distinctes dans le localStorage (`fia-profile-j1` et `fia-profile-j2`). L’ancienne sauvegarde `agent-demo` est récupérée dans J1 à sa première ouverture, sans supprimer la source. La sélection est conservée dans le sessionStorage de l’onglet jusqu’à déconnexion. Le profil MJ affiche les résumés des deux fiches sur le même navigateur et permet leur actualisation.

Ces profils sont une sélection de terminal, pas une authentification ni un contrôle d’accès. Aucun partage entre appareils n’est encore fourni.

Validation profils : ouverture MJ/J1/J2, sauvegarde et rechargement de session, déconnexion, isolation des messages J1/J2, aperçu MJ, migration de l’ancienne sauvegarde et affichage mobile.

## Glossaire des corporations — éditeur MJ

Dix corporations : Arasaka, Militech, Kang Tao, Biotechnica, Petrochem, SovOil, Trauma Team, Night Corp, Zetatech et Kiroshi. Les textes initiaux sont dans `corporations.js`. Le stockage et la migration sont dans `glossary-model.js`, l’interface dans `glossary.js`.

Depuis MJ → Glossaire / Connaissances :

- Modifier le nom, le secteur, l’origine et la source HTTPS de la corporation.
- Ajouter des blocs avec titre et texte ; ils sont masqués par défaut.
- Éditer chaque bloc et cocher J1 et/ou J2, puis enregistrer.
- Supprimer un bloc après confirmation.
- Exporter le dossier de chaque joueur : seuls ses blocs visibles sont inclus.

Les trois niveaux ont été supprimés de l’interface. Lors de la première utilisation, les six rubriques initiales de chaque corporation deviennent six blocs indépendants. Les anciens réglages sont convertis en visibilité par bloc, sans supprimer la sauvegarde source. Les modifications sont conservées dans `fia-glossary-editor-v1`.

Les joueurs n’affichent et ne recherchent que leurs blocs visibles. Ils peuvent importer le dossier JSON du MJ ; le fichier est validé et enregistré dans `fia-glossary-received-j1` ou `fia-glossary-received-j2`. Un enregistrement MJ dans le même navigateur remplace ces copies reçues par les données locales à jour. Les nouveaux exports sont au format `fia-glossary-blocks`, version 1 ; les anciens fichiers de niveaux doivent être réexportés depuis le MJ.

### Limites et sources

Le fonctionnement reste local au navigateur. Pour un autre appareil, envoyer le fichier exporté au joueur et le réimporter après chaque changement. Il n’y a pas de synchronisation automatique ni d’authentification ; le filtrage d’affichage ne constitue pas un contrôle d’accès sécurisé.

Le wiki `cyberpunk.fandom.com` et son serveur d’images `static.wikia.nocookie.net` sont bloqués par le proxy (CONNECT 403). Les textes initiaux restent provisoires et les SVG de `public/corporations/` sont des signatures graphiques non officielles. Autoriser ces domaines est nécessaire pour vérifier les textes et récupérer les vrais logos. Les fiches comportent les liens des sources prévues ; le MJ peut les modifier. Les pages externes peuvent contenir des spoilers.

### Vérifications

Compilation et parcours Chromium : migration des anciens réglages, ajout/modification/suppression des blocs, visibilité indépendante J1/J2, sauvegarde après rechargement, recherche excluant les blocs masqués, export excluant leur contenu, import du dossier joueur, édition de la présentation et affichage mobile MJ/joueur sans débordement, aucune erreur JavaScript.

## Carte tactique de Night City

Onglet « Carte » pour J1/J2 et bouton « Carte / Night City » pour le MJ. Le plan SVG original présente les six districts urbains, les Badlands, un repère Dogtown (Phantom Liberty) et 17 lieux. Données dans `night-city-data.js`, interactions dans `night-city.js`.

Fonctions : déplacement par glisser, zoom borné de 100 à 500 %, recentrage, sélection des districts et lieux, fiches descriptives, recherche, filtres district/type. Contrôles clavier : Tab puis Entrée/Espace pour choisir les éléments ; sur le plan, flèches pour déplacer, +/− pour zoomer et 0 pour recentrer. Sur écran tactile : glisser et pincement. Sur ordinateur : boutons de zoom ou Ctrl/molette. Aucun service de tuiles externe ni dépendance cartographique.

### Précision et références

Ce plan est schématique et non à l’échelle. Routes, limites et positions sont dessinées approximativement pour le jeu de rôle. Il ne reproduit pas la carte du jeu et ne fournit pas d’itinéraire. Les descriptions restent provisoires.

Les tentatives de consultation de `https://night-city-geoguessr.site/` et `https://cyberpunk.fandom.com/wiki/Night_City` ont échoué (proxy CONNECT 403). Aucune image ni donnée n’a été extraite de ces sites. Les liens sont proposés comme références à consulter ; il faut autoriser `night-city-geoguessr.site` et `cyberpunk.fandom.com` dans les paramètres réseau pour vérifier la géographie et les informations. Les sites peuvent nécessiter d’autres domaines de ressources après ce premier accès.

Validation : compilation, accès joueurs/MJ, sept secteurs et 17 lieux, sélection et descriptions, zoom/recentrage/déplacement, clavier, recherche sans résultat, filtres croisés et affichage à 390/768/1024 pixels sans débordement. Aucune erreur JavaScript pendant le parcours. Le pincement est implémenté mais reste à vérifier sur téléphone réel.

## Carte de référence fournie — recalage et import local

Le plan utilise désormais le repère 956 × 980 de l’image fournie par l’utilisateur. Les contours sont retracés visuellement et les repères repositionnés approximativement. Les routes fictives du précédent schéma sont supprimées. Les emplacements précis des lieux restent à valider.

L’image de la conversation n’est pas accessible comme fichier dans l’exécuteur : aucun fond satellite fourni n’est donc présent dans le dépôt. MJ → Carte → « Importer la carte de référence » permet de sélectionner cette image complète en PNG/JPG/WebP, jusqu’à 20 Mo, sans recadrage. Le ratio doit correspondre à 956 × 980 (tolérance de 2 %).

Le Blob est conservé dans IndexedDB (`fia-map-assets`), commun aux profils du même navigateur et de la même origine. Il suit exactement les transformations des zones et repères. L’import est réservé à l’interface MJ ; un bouton permet de retirer le fond. Les joueurs voient le fond importé lorsqu’ils ouvrent leur carte. Sans fond, seuls les contours recalés sont affichés.

Le fichier n’est pas envoyé à GitHub et ne se synchronise pas entre appareils. Pour un fond par défaut partagé par tous, il faut récupérer le fichier original dans le dépôt puis le publier comme ressource statique. Cette partie reste en attente de l’accès au fichier.

Validation supplémentaire avec une image de test générée de 956 × 980 (pas l’image utilisateur) : import, validation du type, conservation du fond existant en cas d’image invalide, persistance IndexedDB après rechargement, affichage joueur, contrôles réservés au MJ, suppression du fond et rendu mobile. Les contrôles de carte précédents passent également.

## Carte — section Corporations

Une section dépliable permet de choisir l’une des dix corporations. La sélection isole ses repères et superpose des polygones d’influence ; trois cases commandent séparément QG local (losange), sites principaux (cercles) et influence (zones colorées en pointillé). Les repères ouvrent les fiches existantes et restent compatibles avec recherche, district, type, zoom et fond importé. Choisir une corporation efface les autres filtres pour éviter un résultat vide trompeur. « Effacer la sélection » revient aux lieux généraux.

Les données sont dans `corporation-map-data.js`. Le siège mondial est décrit séparément du QG local : on ne positionne pas Tokyo ou Washington à Night City. Plusieurs corporations n’ont pas de site local suffisamment renseigné ; un état explicite le signale. Les rattachements et positions existants restent provisoires, les références étant toujours inaccessibles. L’implantation industrielle Petrochem est explicitement une proposition de campagne non vérifiée.

Les zones d’influence sont des propositions pour la campagne, pas des frontières canoniques, des possessions ou un contrôle exclusif. Elles sont dessinées sur les sous-quartiers plutôt que sur tous les districts. Trauma Team n’est pas représentée comme possédant la ville sous prétexte de couverture médicale.

Validation : dix choix de corporation, sélection Arasaka (QG local et trois sites), activation indépendante des couches, fiches, filtres croisés, distinction des sièges hors carte, états sans site renseigné, chargement des visuels, retour aux lieux généraux, profils MJ/joueur et affichage mobile ; régression de l’import et de la conservation du fond de carte.

## Arborescence des corporations et lieux affiliés

La liste déroulante simple est remplacée par une arborescence native accessible : « Corporations » → ouvrir Arasaka (ou une autre corporation) → choisir un lieu affilié. L’ouverture d’une branche active sa couche et ferme visuellement l’ancienne. Un clic sur le lieu réactive sa couche si nécessaire, centre la carte et ouvre sa fiche. Les filtres précédents sont remis à zéro lors d’un changement de corporation ou d’une sélection dans l’arbre.

Arasaka présente six entrées : tour, Waterfront, parc industriel, Konpeki Plaza, domaine Arasaka et Ebunike (lien avec Adam Smasher, sans affirmation de propriété). Militech comprend également une entrée Cynosure liée à Phantom Liberty, explicitement signalée comme spoiler et approximative. Les corporations sans emplacement renseigné affichent un message dédié.

Les nouvelles tentatives d’accès au wiki et à Geoguessr ont encore été refusées par le proxy (CONNECT 403). Les ajouts proviennent de connaissances générales de l’univers, avec des pages de référence prévues et des positions à vérifier ; ils ne sont pas présentés comme le résultat d’une consultation réussie d’Internet.

Validation : dix corporations dans l’arbre, six lieux Arasaka, sélection/centrage/fiches, restauration d’une couche masquée lors du choix d’un lieu, changement de branche, Cynosure, état sans site, retour aux lieux généraux, navigation clavier, profils MJ/joueur et largeurs 390/768/1024 pixels sans débordement. Aucune erreur JavaScript.

## Carte — panneau droit et fenêtres de lieu

La section Corporations est placée dans la colonne droite de la carte sur ordinateur ; elle passe sous la carte sur petit écran. Le panneau descriptif permanent des districts et la liste « Lieux répertoriés » sont supprimés. Les filtres de recherche, district et type sont conservés.

Un clic sur un repère ouvre une fenêtre modale native avec le nom, le quartier, la corporation si applicable, la description et le lien de référence. Le choix d’un lieu dans l’arbre centre la carte et ouvre la même fenêtre. Fermeture par croix, Échap ou clic sur le fond extérieur ; le focus revient au repère ou à l’entrée de l’arbre. Les zones cliquables de deux repères proches ont été réduites pour éviter une interception au centre du cercle voisin.

Validation Chromium : disposition du panneau à droite, suppression des anciens panneaux, clic réel sur un cercle, ouverture depuis l’arbre, fermeture par les trois méthodes, retour du focus, ouverture clavier, fenêtre et page sans débordement à 390 pixels, accès MJ/joueur, aucune erreur JavaScript. Compilation réussie.

### Influence Arasaka — choix de campagne

À la demande du MJ, la surbrillance Arasaka couvre désormais tout City Center, le sud de Watson, le secteur du domaine Arasaka à North Oak et Santo Domingo (interprétation de « porto domingo »). Arasaka Waterfront et Northside restent inclus. Les contours complets de City Center et Santo Domingo reprennent ceux de la carte de référence ; les deux autres secteurs sont des polygones approximatifs. Ce périmètre est un choix de campagne, pas une affirmation supplémentaire de contrôle canonique.

Validation : compilation et contrôle dans Chromium des six zones et de leur interrupteur d’affichage.

### Influence Biotechnica — serres du sud-ouest

Le périmètre agricole de Biotechnica est recalé sur les grands champs de serres en bas à gauche de la carte fournie. Un second polygone couvre leur arrière-pays dans les Badlands du sud. Corpo Plaza reste inclus. Le repère « Biotechnica Flats — serres » se trouve désormais au cœur du secteur agricole sud-ouest. Périmètres d’influence de campagne et position approximative.

Validation : compilation, trois zones Biotechnica dans Chromium, position du repère, ouverture de sa fiche et interrupteur d’influence.

### Influence — Westbrook, nord de Watson et Trauma Team

Arasaka couvre désormais l’ensemble de Westbrook, ce qui englobe aussi le domaine Arasaka : l’ancien petit polygone du domaine est remplacé pour éviter une double opacité. SovOil conserve sa zone énergétique et ajoute la bande au nord de Watson. Trauma Team couvre les cinq districts urbains hors Pacifica : Watson, Westbrook, City Center, Heywood et Santo Domingo. Pacifica (donc Dogtown) et les Badlands sont exclus. Il s’agit d’une couverture médicale définie pour la campagne, pas d’une possession territoriale.

Validation : compilation, contrôle des contours et exclusions, sélection des trois couches dans Chromium et activation/désactivation de la surbrillance.

## Carte — Gangs et clans

La section « Gangs » apparaît sous « Corporations » dans la colonne droite. Elle contient les huit groupes majeurs de 2077 (Maelstrom, Tyger Claws, Valentinos, 6th Street, Voodoo Boys, Animals, Mox et Scavengers), puis le Barghest et les groupes nomades Aldecaldos/Wraiths, dont la nature est explicitement distinguée.

`gang-map-data.js` décrit onze groupes et 21 lieux affiliés. Chaque branche dépliable sélectionne une couche, affiche ses repaires/lieux et ses polygones d’influence. Le choix d’un lieu ouvre la fenêtre existante. Les options Repaire/Camp, Lieux et Influence sont indépendantes et distinctes des réglages des corporations. Sélectionner une corporation ou un gang désactive l’autre couche ; les périmètres de campagne des corporations sont conservés.

Les sources wiki n’ont pas pu être consultées : nouvelle requête sur `https://cyberpunk.fandom.com/wiki/Gangs` refusée par le proxy (CONNECT 403). Les données viennent donc de connaissances générales, avec références prévues, et restent à vérifier. Les positions et contours sont approximatifs. Les zones des Scavengers représentent une présence diffuse, celles des Animals des contrats, les camps nomades sont mobiles. Les établissements associés ne sont pas automatiquement des propriétés du groupe ; les changements possibles liés aux missions sont signalés.

Validation Chromium : onze groupes, 21 lieux, sélection de chaque couche et ouverture de sa fiche, interrupteurs repaires/lieux/influence, recherche et filtre de catégorie, bascule corporations/gangs, retour aux lieux généraux, profils MJ/joueur et largeurs 390/768/1024 sans débordement. Aucune erreur JavaScript. Compilation réussie.

## Carte — Merc, bars et fixeurs

La section « Merc » est placée sous Gangs. Elle propose une sélection de huit bars/points de rendez-vous : Afterlife, Lizzie’s Bar, El Coyote Cojo, Electric Orgasm, Heavy Hearts, Riot, Dicky Twister et Sunset Motel. Huit fixeurs ont leur branche : Rogue Amendiares, Regina Jones, Wakako Okada, Padre, El Capitán, Dino Dinovic, Dakota Smith et Mr. Hands.

`merc-map-data.js` associe les lieux et les secteurs de contrats. Les points de contact sont distingués des autres lieux par un losange et une option spécifique. Les options Points de contact, Bars/Rendez-vous et Réseau d’influence sont indépendantes de celles des corporations et gangs. La sélection d’une couche désactive les deux autres familles. Les mêmes lieux peuvent apparaître dans la sélection générale et chez leur fixer avec des identifiants propres à chaque branche, pour garantir le retour du focus après fermeture de la fiche.

L’influence d’un fixer représente ses contacts et sa zone habituelle de contrats, pas une possession territoriale. Rogue possède une portée transversale aux districts urbains ; les autres fixeurs sont associés à leur secteur habituel. Les points de Padre et d’El Capitán sont explicitement indicatifs. Le Coyote Cojo et le Sunset Motel ne sont pas présentés comme des bureaux officiels de leurs contacts. Heavy Hearts est lié à Phantom Liberty.

Les descriptions et coordonnées restent provisoires, avec des liens wiki de référence prévus, non vérifiés depuis cet environnement. La sélection n’est pas un inventaire exhaustif des lieux de 2077.

Validation Chromium : neuf branches (bars + huit fixeurs), repères et réseaux de chaque branche, fenêtres et retour du focus, options de visibilité, recherche/catégorie, retour aux lieux généraux, régression corporations/gangs, MJ/joueur et largeurs 390/768/1024 sans débordement. Compilation réussie, aucune erreur JavaScript.

## Photos des lieux corporatistes — récupération à valider

`place-images.js` ajoute un emplacement photo aux fenêtres des sites corporatistes. À l’ouverture seulement, le navigateur interroge l’API PageImages du Cyberpunk Wiki pour l’article du lieu, puis affiche son image principale avec un lien de référence. Aucune image générée ou photo de ville réelle n’est substituée. Les pages générales de corporation ne sont pas utilisées pour éviter d’afficher leur logo à la place d’un bâtiment ; les titres des pages de bâtiments sont des candidats qui restent à vérifier.

Les images doivent provenir d’un hôte HTTPS du domaine `wikia.nocookie.net`. Les échecs d’API, de chargement ou l’absence d’image affichent un message explicite, sans image cassée. La récupération est annulée à la fermeture de la fenêtre ; les délais API/image sont bornés. Les sites trop peu renseignés ne reçoivent pas de fausse référence photo.

**État réel : aucune photo Internet n’a été récupérée ni vérifiée.** Les requêtes à `cyberpunk.fandom.com/wiki/Arasaka_Tower` et à Wikimedia sont refusées par le proxy (CONNECT 403). La lecture du brouillon de configuration réseau échoue également. Il reste à autoriser `cyberpunk.fandom.com` et `static.wikia.nocookie.net`, vérifier les pages et les photos, puis idéalement conserver des références vérifiées ou des fichiers locaux avec leurs crédits. Le fonctionnement en direct dans le navigateur public dépend aussi de l’API, de ses règles CORS et de l’accès au CDN ; il n’est pas garanti par les tests simulés.

Validation effectuée : compilation et tests Chromium avec API/CDN simulés, chargement d’une image de test, attribution, fenêtre mobile, réponse réseau en échec, site sans référence photo et fermeture sans erreur JavaScript. Ces tests vérifient l’interface, pas l’existence des photos réelles.
