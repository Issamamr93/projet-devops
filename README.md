# Projet DevOps — Gestionnaire de tâches

Application web simple de gestion de tâches (to-do list), réalisée dans le cadre de la Licence 3.

## Étape 1 (actuelle) : Front-end seul

- **HTML / CSS / JavaScript** (sans framework)
- Les données sont stockées dans le navigateur (`localStorage`) — pas encore de base de données ni de back-end.

### Fonctionnalités
- Ajouter une tâche
- Cocher / décocher une tâche comme terminée
- Supprimer une tâche
- Filtrer : toutes / à faire / terminées
- Supprimer toutes les tâches terminées
- Les tâches restent après un rechargement de la page

### Lancer le projet
Ouvrir `frontend/index.html` dans un navigateur (double-clic suffit).

Ou, avec l'extension **Live Server** de VS Code : clic droit sur `index.html` → *Open with Live Server*.

## Structure

```
Projet-DevOps/
├── README.md
└── frontend/
    ├── index.html       → structure de la page
    ├── css/
    │   └── style.css    → mise en forme
    └── js/
        ├── storage.js   → couche données (localStorage, puis API plus tard)
        └── app.js       → logique de l'interface (affichage, événements)
```

### Pourquoi séparer `storage.js` et `app.js` ?
C'est le principe de **séparation des responsabilités** :
- `app.js` s'occupe de l'affichage et ne sait pas *où* sont les données.
- `storage.js` est le seul fichier qui accède aux données.

Quand on ajoutera le back-end Node.js, il suffira de modifier `storage.js` pour qu'il utilise `fetch()` vers l'API. `app.js` ne changera pas.

## Étape 2 (à venir) : Back-end Node.js

API REST prévue :

| Méthode | Route            | Action                  |
|---------|------------------|-------------------------|
| GET     | `/api/tasks`     | Lister les tâches       |
| POST    | `/api/tasks`     | Créer une tâche         |
| PUT     | `/api/tasks/:id` | Modifier une tâche      |
| DELETE  | `/api/tasks/:id` | Supprimer une tâche     |
