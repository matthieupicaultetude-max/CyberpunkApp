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
