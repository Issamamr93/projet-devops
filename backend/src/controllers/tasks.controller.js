/**
 * ===== CONTRÔLEUR (tasks.controller.js) =====
 *
 * Reçoit la requête HTTP, vérifie les données envoyées par le client,
 * appelle le repository, puis renvoie la réponse avec le bon code HTTP :
 *
 *   200 OK          → succès
 *   201 Created     → ressource créée
 *   204 No Content  → succès, sans contenu à renvoyer (suppression)
 *   400 Bad Request → données invalides envoyées par le client
 *   404 Not Found   → la tâche n'existe pas
 */

const repository = require("../data/tasks.repository");

const MAX_TITLE_LENGTH = 100;

// Vérifie un titre ; renvoie un message d'erreur ou null si tout va bien.
// Règle d'or : ne JAMAIS faire confiance aux données du client, même si
// le front-end vérifie déjà (n'importe qui peut appeler l'API directement).
function validateTitle(title) {
  if (typeof title !== "string" || title.trim() === "") {
    return "Le titre est obligatoire";
  }
  if (title.trim().length > MAX_TITLE_LENGTH) {
    return `Le titre ne doit pas dépasser ${MAX_TITLE_LENGTH} caractères`;
  }
  return null;
}

// GET /api/tasks
async function getAll(req, res) {
  const tasks = await repository.findAll();
  res.json(tasks);
}

// GET /api/tasks/:id
async function getOne(req, res) {
  const task = await repository.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
}

// POST /api/tasks      corps : { "title": "..." }
async function create(req, res) {
  const error = validateTitle(req.body?.title);
  if (error) return res.status(400).json({ error });

  const task = await repository.create(req.body.title.trim());
  res.status(201).json(task);
}

// PUT /api/tasks/:id   corps : { "title"?: "...", "done"?: true/false }
async function update(req, res) {
  const { title, done } = req.body ?? {};
  const changes = {};

  // On ne garde que les champs autorisés (le client ne peut pas changer l'id, etc.)
  if (title !== undefined) {
    const error = validateTitle(title);
    if (error) return res.status(400).json({ error });
    changes.title = title.trim();
  }
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "Le champ 'done' doit être true ou false" });
    }
    changes.done = done;
  }

  const task = await repository.update(req.params.id, changes);
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
}

// DELETE /api/tasks/:id
async function remove(req, res) {
  const deleted = await repository.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Tâche introuvable" });
  res.status(204).end();
}

module.exports = { getAll, getOne, create, update, remove };
