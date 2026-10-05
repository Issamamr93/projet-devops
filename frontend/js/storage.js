/**
 * ===== COUCHE DONNÉES (storage.js) =====
 *
 * Ce fichier est le SEUL endroit du front-end qui sait OÙ sont les tâches.
 *
 * Étape 1 : elles étaient dans le navigateur (localStorage).
 * Étape 2 (maintenant) : elles sont sur le serveur Node.js, et on les
 * manipule via l'API REST avec fetch().
 *
 * Les fonctions gardent exactement les mêmes noms et renvoient les mêmes
 * données qu'avant : app.js n'a donc pas eu besoin d'être modifié.
 *
 * Format d'une tâche :
 *   { id: "a1b2c3...", title: "Réviser le cours", done: false, createdAt: "2026-10-05T..." }
 */

// API_BASE_URL est défini dans config.js (selon l'environnement)
const API_URL = `${API_BASE_URL}/api/tasks`;

// Fonction utilitaire : envoie une requête à l'API et gère les erreurs
async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // response.ok est vrai pour les codes 200 à 299
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || `Erreur HTTP ${response.status}`;
    alert(message);
    throw new Error(message);
  }

  // 204 No Content : pas de corps à lire
  if (response.status === 204) return null;
  return response.json();
}

const TaskService = {
  // Récupérer toutes les tâches
  async getAll() {
    return request(API_URL);
  },

  // Créer une tâche
  async create(title) {
    return request(API_URL, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  // Modifier une tâche (ex: { done: true })
  async update(id, changes) {
    return request(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    });
  },

  // Supprimer une tâche
  async remove(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
  },
};
