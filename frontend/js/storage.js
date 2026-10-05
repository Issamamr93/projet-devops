/**
 * ===== COUCHE DONNÉES (storage.js) =====
 *
 * Ce fichier est le SEUL endroit qui sait OÙ sont stockées les tâches.
 * Pour l'instant : dans le navigateur (localStorage).
 * Plus tard : on remplacera le contenu de ces fonctions par des appels
 * fetch() vers le back-end Node.js, SANS toucher à app.js.
 *
 * Toutes les fonctions sont "async" (elles renvoient une Promise) même si
 * localStorage est synchrone. Pourquoi ? Parce qu'un appel réseau vers une
 * API est asynchrone : en préparant ça dès maintenant, la migration vers
 * le back-end sera transparente pour le reste du code.
 *
 * Format d'une tâche :
 *   { id: "1696500000000", title: "Réviser le cours", done: false, createdAt: "2026-10-05T..." }
 */

const STORAGE_KEY = "tasks";

// Lit le tableau de tâches depuis localStorage (ou un tableau vide)
function readTasks() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

// Enregistre le tableau de tâches dans localStorage
function writeTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const TaskService = {
  // Récupérer toutes les tâches       → futur : GET    /api/tasks
  async getAll() {
    return readTasks();
  },

  // Créer une tâche                     → futur : POST   /api/tasks
  async create(title) {
    const tasks = readTasks();
    const newTask = {
      id: Date.now().toString(),
      title: title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    writeTasks(tasks);
    return newTask;
  },

  // Modifier une tâche (ex: done=true)  → futur : PUT    /api/tasks/:id
  async update(id, changes) {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error("Tâche introuvable");
    Object.assign(task, changes);
    writeTasks(tasks);
    return task;
  },

  // Supprimer une tâche                 → futur : DELETE /api/tasks/:id
  async remove(id) {
    const tasks = readTasks().filter((t) => t.id !== id);
    writeTasks(tasks);
  },
};
