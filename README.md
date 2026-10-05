# Projet DevOps — Gestionnaire de tâches

Application web de gestion de tâches (to-do list), réalisée dans le cadre de la Licence 3.

- **Front-end** : HTML / CSS / JavaScript (sans framework)
- **Back-end** : Node.js + Express (API REST)
- **Stockage** : fichier JSON côté serveur (pas encore de base de données)

## Lancer le projet

Prérequis : [Node.js](https://nodejs.org) (version 18 ou plus).

```bash
cd backend
npm install      # installe Express (une seule fois)
npm run dev      # démarre le serveur (redémarre tout seul à chaque modification)
```

Puis ouvrir **http://localhost:3000** dans le navigateur.

> `npm start` lance le serveur sans le redémarrage automatique (mode "production").

## Fonctionnalités
- Ajouter, cocher / décocher, supprimer une tâche
- Filtrer : toutes / à faire / terminées
- Supprimer toutes les tâches terminées
- Les tâches sont enregistrées sur le serveur (`backend/data/tasks.json`)

## Architecture

```
 Navigateur                                   Serveur Node.js (port 3000)
┌──────────────────────┐   HTTP + JSON   ┌───────────────────────────────────────┐
│ app.js  (affichage)  │                 │ routes  → controller  → repository    │
│   ↓                  │  fetch("/api")  │ (URL)     (validation)  (lecture /     │
│ storage.js (données) │ ──────────────► │                          écriture JSON)│
└──────────────────────┘ ◄────────────── └───────────────────────────────────────┘
                                                              ↓
                                                    backend/data/tasks.json
```

## Structure

```
Projet-DevOps/
├── README.md
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── storage.js        → appels à l'API avec fetch()
│       └── app.js            → affichage et événements
└── backend/
    ├── package.json          → dépendances et scripts npm
    ├── data/tasks.json       → les données (créé automatiquement, ignoré par Git)
    └── src/
        ├── server.js         → démarre le serveur
        ├── app.js            → configuration d'Express (middlewares)
        ├── routes/           → URL → fonction
        ├── controllers/      → validation + codes HTTP
        └── data/             → accès aux données (repository)
```

### Le principe : la séparation des responsabilités
Chaque fichier a **un seul rôle**. Résultat : en passant de `localStorage` à l'API, seul `storage.js` a changé, et `app.js` est resté identique. De la même façon, quand on ajoutera une base de données, seul `tasks.repository.js` changera.

## API REST

| Méthode | Route            | Corps (JSON)                    | Réponse                     |
|---------|------------------|---------------------------------|-----------------------------|
| GET     | `/api/tasks`     | —                               | `200` liste des tâches      |
| GET     | `/api/tasks/:id` | —                               | `200` la tâche / `404`      |
| POST    | `/api/tasks`     | `{ "title": "..." }`            | `201` tâche créée / `400`   |
| PUT     | `/api/tasks/:id` | `{ "title"?: "...", "done"?: true }` | `200` tâche modifiée / `400` / `404` |
| DELETE  | `/api/tasks/:id` | —                               | `204` / `404`               |

### Tester l'API sans le front-end (avec curl)

```bash
curl http://localhost:3000/api/tasks
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Ma tâche\"}"
curl -X PUT http://localhost:3000/api/tasks/ID -H "Content-Type: application/json" -d "{\"done\":true}"
curl -X DELETE http://localhost:3000/api/tasks/ID
```

On peut aussi utiliser **Postman** ou l'extension VS Code **REST Client**.

## Prochaines étapes possibles
- Base de données (SQLite, PostgreSQL ou MongoDB) → remplacer `tasks.repository.js`
- Tests automatisés de l'API (Jest + Supertest)
- Conteneurisation avec Docker
- Intégration continue avec GitHub Actions
