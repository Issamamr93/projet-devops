/**
 * ===== POINT D'ENTRÉE (server.js) =====
 *
 * Ce fichier démarre le serveur HTTP.
 * Toute la configuration d'Express se trouve dans app.js.
 */

const app = require("./app");

// Le port peut être changé via une variable d'environnement (utile en DevOps :
// Docker, hébergeur...). Sinon on utilise 3000 par défaut.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`   API disponible sur http://localhost:${PORT}/api/tasks`);
});
