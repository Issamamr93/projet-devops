# Front-end — Gestionnaire de tâches

Interface web en **HTML / CSS / JavaScript** (sans framework). Elle communique avec l'API du back-end via `fetch()`.

Ce projet est **indépendant** du back-end : il ne contient que des fichiers statiques.

## Lancer en local

1. Démarrer le back-end (voir `../backend/README.md`) sur http://localhost:3000
2. Servir ce dossier sur le **port 5500** :
   - extension VS Code **Live Server** : clic droit sur `index.html` → *Open with Live Server*
   - ou : `python -m http.server 5500`
3. Ouvrir http://localhost:5500

> Le port 5500 est important : c'est l'origine autorisée par le back-end (CORS), et `config.js` s'en sert pour savoir où joindre l'API.

## Lancer avec Docker

Dans Docker, le front-end est servi par **Nginx**, qui redirige aussi `/api/...` vers le conteneur du back-end (reverse proxy). Il faut donc lancer les deux projets ensemble, avec le `docker-compose.yml` à la racine du dépôt.

## Structure

```
frontend/
├── Dockerfile        → image Nginx
├── nginx.conf        → fichiers statiques + redirection de /api vers le back-end
├── index.html
├── css/style.css
└── js/
    ├── config.js     → adresse de l'API selon l'environnement
    ├── storage.js    → appels à l'API (fetch)
    └── app.js        → affichage et événements
```
