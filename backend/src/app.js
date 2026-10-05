/**
 * ===== CONFIGURATION D'EXPRESS (app.js) =====
 *
 * Express fonctionne avec des "middlewares" : des fonctions exécutées
 * les unes après les autres pour chaque requête, dans l'ordre où on
 * les déclare avec app.use().
 *
 *   Requête → express.json() → logger → routes → 404 → gestion d'erreurs → Réponse
 */

const path = require("path");
const express = require("express");
const tasksRoutes = require("./routes/tasks.routes");

const app = express();

// 1. Lit le corps des requêtes au format JSON et le met dans req.body
app.use(express.json());

// 2. Petit logger : affiche chaque requête dans la console
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${req.url}`);
  next(); // passe au middleware suivant
});

// 3. Les routes de l'API
app.use("/api/tasks", tasksRoutes);

// 4. Sert le front-end (fichiers HTML/CSS/JS) sur la même adresse.
//    Avantage : front et API ont la même origine → pas de problème de CORS.
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// 5. Route inconnue → erreur 404
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// 6. Gestion centralisée des erreurs (reconnue par Express grâce à ses 4 paramètres).
//    Avec Express 5, une erreur levée dans une fonction async arrive ici automatiquement.
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;
