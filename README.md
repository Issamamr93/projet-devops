# Projet DevOps — Gestionnaire de tâches

Application web de gestion de tâches (to-do list), réalisée dans le cadre de la Licence 3.

Le dépôt contient **deux projets indépendants** et une base de données :

| Projet | Technologies | Rôle | Documentation |
|---|---|---|---|
| [`frontend/`](frontend/) | HTML, CSS, JavaScript, Nginx | Interface web | [frontend/README.md](frontend/README.md) |
| [`backend/`](backend/) | Node.js, Express | API REST | [backend/README.md](backend/README.md) |
| [`database/`](database/) | PostgreSQL 17 | Stockage des tâches (`init.sql` crée la table) | — |

Chacun a son propre `Dockerfile`, son propre README et peut être lancé seul.

## Architecture

```
                                     Docker
          ┌─────────────────────────────────────────────────────────────────────────┐
          │  frontend (Nginx)            backend (Node.js)        db (PostgreSQL)   │
Navigateur│  ┌──────────────────┐ /api  ┌──────────────────┐ SQL ┌───────────────┐  │
 :8080 ──►│  │ HTML / CSS / JS  │ ────► │ API REST Express │ ──► │ table "tasks" │  │
          │  │ + reverse proxy  │ ◄──── │                  │ ◄── │               │  │
          │  └──────────────────┘       └──────────────────┘     └───────┬───────┘  │
          │                                                     volume "db-data"    │
          └─────────────────────────────────────────────────────────────────────────┘
```

## Lancer le projet avec Docker

Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré.

```bash
docker compose up -d --build
```

- Application : **http://localhost:8080**
- API (accès direct) : http://localhost:3000/api/tasks
- PostgreSQL : `localhost:5432` (utilisateur, mot de passe et base : `taches`, valeurs de développement)

| Commande | Effet |
|---|---|
| `docker compose ps` | État des conteneurs (doivent être `Up`) |
| `docker compose logs -f` | Logs de tous les conteneurs en direct |
| `docker compose logs -f backend` | Logs d'un seul conteneur |
| `docker compose down` | Arrêter et supprimer les conteneurs (les tâches sont conservées) |
| `docker compose down -v` | Idem, **en supprimant aussi les données** (volume) |
| `docker compose exec db psql -U taches -d taches` | Ouvrir une console SQL dans la base (`\q` pour quitter) |

## Lancer sans Docker (développement)

Le back-end a besoin de PostgreSQL : le plus simple est de lancer uniquement la base avec Docker :

```bash
docker compose up -d db
```

Puis, dans deux terminaux :

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
python -m http.server 5500
```

Puis ouvrir **http://localhost:5500**. Le front (port 5500) et l'API (port 3000) ont deux origines différentes : c'est le middleware **CORS** du back-end qui autorise ces appels.

## Le principe : la séparation des responsabilités
- Côté front, seul `storage.js` sait comment joindre les données : en passant de `localStorage` à l'API, `app.js` n'a pas changé.
- Côté back, seul `tasks.repository.js` sait où sont stockées les tâches : en passant du fichier JSON à PostgreSQL, seul ce fichier a changé (et `db.js` a été ajouté).
- Front et back sont deux projets séparés qui ne communiquent que par HTTP : on peut modifier, déployer ou remplacer l'un sans toucher à l'autre.

## Prochaines étapes possibles
- Tests automatisés de l'API (Jest + Supertest)
- Intégration continue avec GitHub Actions
