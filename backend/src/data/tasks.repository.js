/**
 * ===== REPOSITORY (tasks.repository.js) =====
 *
 * Le SEUL fichier du back-end qui sait où sont stockées les tâches.
 * Pour l'instant : dans un fichier JSON (backend/data/tasks.json).
 * Plus tard : on remplacera ces fonctions par des requêtes vers une
 * vraie base de données, SANS toucher au contrôleur ni aux routes.
 *
 * (C'est exactement la même idée que storage.js côté front-end.)
 */

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const DATA_FILE = path.join(__dirname, "..", "..", "data", "tasks.json");

// Lit toutes les tâches depuis le fichier (tableau vide si le fichier n'existe pas encore)
async function readTasks() {
  try {
    const json = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(json);
  } catch (err) {
    if (err.code === "ENOENT") return []; // ENOENT = fichier inexistant
    throw err;
  }
}

// Écrit toutes les tâches dans le fichier (crée le dossier si besoin)
async function writeTasks(tasks) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

async function findAll() {
  return readTasks();
}

async function findById(id) {
  const tasks = await readTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

async function create(title) {
  const tasks = await readTasks();
  const task = {
    id: crypto.randomUUID(), // identifiant unique généré par le serveur
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

// Renvoie la tâche modifiée, ou null si elle n'existe pas
async function update(id, changes) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, changes);
  await writeTasks(tasks);
  return task;
}

// Renvoie true si une tâche a été supprimée, false sinon
async function remove(id) {
  const tasks = await readTasks();
  const remaining = tasks.filter((t) => t.id !== id);
  if (remaining.length === tasks.length) return false;
  await writeTasks(remaining);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
