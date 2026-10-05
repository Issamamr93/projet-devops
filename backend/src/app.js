/**
 * ===== CONFIGURATION D'EXPRESS (app.js) =====
 *
 * Express fonctionne avec des "middlewares" : des fonctions exécutées
 * les unes après les autres pour chaque requête, dans l'ordre où on
 * les déclare avec app.use().
 *
 *   Requête → express.json() → logger → CORS → routes → 404 → gestion d'erreurs → Réponse
 *
 * Le back-end est un projet indépendant : il ne sert QUE l'API.
 * Le front-end est servi ailleurs (Nginx dans Docker, Live Server en dev).
 */

const express = require("express");
const tasksRoutes = require("./routes/tasks.routes");
const cors = require("./middlewares/cors");

const app = express();

// 1. Lit le corps des requêtes au format JSON et le met dans req.body
app.use(express.json());

// 2. Petit logger : affiche chaque requête dans la console
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${req.url}`);
  next(); // passe au middleware suivant
});

// 3. Autorise le front-end (sur une autre origine) à appeler l'API
app.use(cors);

// 4. Page d'accueil de l'API : utile pour vérifier qu'elle tourne
app.get("/", (req, res) => {
  res.json({ name: "API Gestionnaire de tâches", routes: ["/api/tasks"] });
});

// 5. Les routes de l'API
app.use("/api/tasks", tasksRoutes);

// 6. Route inconnue → erreur 404
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// 7. Gestion centralisée des erreurs (reconnue par Express grâce à ses 4 paramètres).
//    Avec Express 5, une erreur levée dans une fonction async arrive ici automatiquement.
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;
