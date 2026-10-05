/**
 * ===== CONFIGURATION (config.js) =====
 *
 * Le front-end et le back-end sont deux projets séparés : le front doit
 * donc savoir à quelle adresse joindre l'API.
 *
 * - En développement (Live Server, port 5500) : l'API tourne à part sur
 *   http://localhost:3000 → on l'appelle directement (le back-end autorise
 *   cette origine grâce à CORS).
 * - Avec Docker : Nginx sert le front ET redirige "/api" vers le conteneur
 *   du back-end → une URL relative suffit, et il n'y a pas de CORS.
 */

const API_BASE_URL =
  window.location.port === "5500" ? "http://localhost:3000" : "";
