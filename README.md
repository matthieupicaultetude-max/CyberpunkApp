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
