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
