/**
 * ===== MIDDLEWARE CORS (cors.js) =====
 *
 * Par sécurité, un navigateur BLOQUE les requêtes fetch() vers une autre
 * "origine" (protocole + domaine + port) que celle de la page.
 *   Page sur http://localhost:5500  →  API sur http://localhost:3000
 *   = deux origines différentes → bloqué, sauf si l'API l'autorise.
 *
 * CORS (Cross-Origin Resource Sharing) : l'API renvoie des en-têtes HTTP
 * qui disent au navigateur quelles origines ont le droit de l'appeler.
 *
 * On l'écrit à la main (au lieu du paquet npm "cors") pour voir ce qui se passe.
 */

// Origines autorisées, séparées par des virgules.
// Modifiable via la variable d'environnement CORS_ORIGIN.
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500"
)
  .split(",")
  .map((origin) => origin.trim());

function cors(req, res, next) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin"); // la réponse dépend de l'origine (pour les caches)
  }

  // Requête "preflight" : avant un PUT/DELETE ou un envoi de JSON, le navigateur
  // envoie d'abord une requête OPTIONS pour demander la permission.
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
}

module.exports = cors;
