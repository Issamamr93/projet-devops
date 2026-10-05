# Back-end — API du gestionnaire de tâches

API REST en **Node.js + Express**. Les tâches sont stockées dans une base **PostgreSQL** (la table est créée par `../database/init.sql`).

Ce projet est **indépendant** du front-end : il ne sert que l'API (pas de HTML).

## Lancer en local

Prérequis : Node.js 18 ou plus, et une base PostgreSQL. Le plus simple : depuis la racine du dépôt, `docker compose up -d db`.

```bash
npm install
npm run dev
```

L'API répond sur **http://localhost:3000**. `npm run dev` redémarre le serveur à chaque modification ; `npm start` le lance sans redémarrage automatique.

## Lancer avec Docker (seul)

```bash
docker build -t projet-devops-backend .
docker run -d -p 3000:3000 -e DB_HOST=host.docker.internal --name backend projet-devops-backend
```

## Routes

| Méthode | Route            | Corps (JSON)                         | Réponse                               |
|---------|------------------|--------------------------------------|---------------------------------------|
| GET     | `/api/tasks`     | —                                    | `200` liste des tâches                |
| GET     | `/api/tasks/:id` | —                                    | `200` la tâche / `404`                |
| POST    | `/api/tasks`     | `{ "title": "..." }`                 | `201` tâche créée / `400`             |
| PUT     | `/api/tasks/:id` | `{ "title"?: "...", "done"?: true }` | `200` tâche modifiée / `400` / `404`  |
| DELETE  | `/api/tasks/:id` | —                                    | `204` / `404`                         |

Pour tester l'API sans le front-end : **Postman** ou l'extension VS Code **REST Client**.

## Variables d'environnement

| Variable      | Défaut                                         | Rôle                                         |
|---------------|------------------------------------------------|----------------------------------------------|
| `PORT`        | `3000`                                         | Port d'écoute                                |
| `DB_HOST`     | `localhost`                                    | Adresse de PostgreSQL (`db` dans Docker)     |
| `DB_PORT`     | `5432`                                         | Port de PostgreSQL                           |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | `taches`               | Identifiants et nom de la base               |
| `CORS_ORIGIN` | `http://localhost:5500,http://127.0.0.1:5500`  | Origines autorisées à appeler l'API (CORS)   |

## Structure

```
backend/
├── Dockerfile
├── package.json
└── src/
    ├── server.js                       → démarre le serveur
    ├── app.js                          → configuration d'Express (middlewares)
    ├── middlewares/cors.js             → autorise le front-end à appeler l'API
    ├── routes/tasks.routes.js          → URL → fonction
    ├── controllers/tasks.controller.js → validation + codes HTTP
    └── data/
        ├── db.js                       → connexion à PostgreSQL (pool)
        └── tasks.repository.js         → requêtes SQL
```
