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

## Glossaire des corporations

10 fiches majeures dans `corporations.js` et interface dans `glossary.js`. Trois niveaux cumulatifs : notoriété publique, connaissance approfondie, renseignements sensibles. Le niveau initial est 1 pour chaque corporation et joueur. MJ → « Glossaire / Connaissances » permet de modifier indépendamment J1 et J2. Les joueurs disposent de l’onglet « Glossaire », d’une recherche et d’un filtre par secteur.

Les réglages sont enregistrés dans `fia-corporation-knowledge-v1`. Les onglets du même navigateur sont actualisés lors des changements. Pour un autre appareil, le MJ exporte le JSON du joueur ; celui-ci l’importe dans son glossaire. L’import refuse les mauvais profils, versions et niveaux et ne modifie pas les fiches de personnage. Ce transfert est manuel et les fichiers restent modifiables : aucun contrôle d’accès réel n’est fourni par cet hébergement statique.

### État des sources

Les pages `https://cyberpunk.fandom.com/wiki/Corporations` et `https://cyberpunk.fandom.com/wiki/Arasaka` ont été bloquées par le proxy (CONNECT 403). Les liens individuels des fiches sont des références prévues, non des pages effectivement consultées. Le contenu est donc provisoire et signalé comme tel dans l’interface. Il faut autoriser `cyberpunk.fandom.com` dans le réseau de l’environnement, consulter les pages et vérifier les résumés avant de considérer ce travail documentaire achevé. Le niveau 3 propose des analyses éditoriales, pas des secrets canoniques. La sélection initiale n’est pas exhaustive.

### Validation glossaire

Compilation et parcours Chromium : 10 corporations, recherche et recherche vide, niveaux 1/2/3 cumulatifs, attributions J1/J2 indépendantes, persistance après rechargement, export/import, rejet d’un fichier pour le mauvais joueur, affichage MJ/joueur à 390/768/1024 pixels sans débordement et aucune erreur JavaScript.


### Fiches détaillées et visuels

La sélection conserve Arasaka, Militech, Kang Tao, Biotechnica, Petrochem, SovOil, Trauma Team, Night Corp, Zetatech et Kiroshi. Chaque corporation possède six rubriques réparties sur trois niveaux : produits et services, exemples concrets, histoire, figures liées, puis renseignements sensibles et mise en perspective. Les personnes liées sont distinguées des employés ou dirigeants. Les spoilers sont signalés dans les rubriques du niveau 3.

Les dix SVG de `public/corporations/` sont des signatures graphiques provisoires créées pour l’interface, pas des logos officiels. Le wiki et `static.wikia.nocookie.net` renvoient toujours un refus du proxy (CONNECT 403). Autoriser ces domaines dans les paramètres réseau est nécessaire pour vérifier les textes et récupérer les vrais logos avec leurs références. Les marquages dans l’interface indiquent cette limite.

Les identifiants et niveaux enregistrés des dix corporations sont conservés. L’import accepte aussi les anciens exports à 21 corporations, en ne reprenant que les dix corporations retenues. Vérifications supplémentaires : chargement des dix SVG, présence de 60 rubriques, lisibilité des sections et import d’un ancien export à 21 entrées.
