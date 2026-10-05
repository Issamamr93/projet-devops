/**
 * ===== REPOSITORY (tasks.repository.js) =====
 *
 * Le SEUL fichier du back-end qui sait où sont stockées les tâches.
 * Avant : un fichier JSON. Maintenant : une base de données PostgreSQL.
 * Les fonctions ont gardé les mêmes noms et renvoient les mêmes données :
 * le contrôleur et les routes n'ont pas changé.
 *
 * Sécurité : les valeurs sont toujours passées en paramètres ($1, $2...)
 * et JAMAIS concaténées dans la requête SQL. PostgreSQL les traite comme
 * des données, ce qui empêche les injections SQL.
 */

const pool = require("./db");

// Colonnes renvoyées à l'API ("created_at" en SQL → "createdAt" en JSON)
const COLUMNS = `id, title, done, created_at AS "createdAt"`;

// L'id arrive de l'URL sous forme de texte : on vérifie que c'est un entier
// (sinon PostgreSQL renverrait une erreur au lieu d'un simple "introuvable")
function toId(id) {
  const number = Number(id);
  return Number.isInteger(number) && number > 0 ? number : null;
}

async function findAll() {
  const result = await pool.query(`SELECT ${COLUMNS} FROM tasks ORDER BY id`);
  return result.rows;
}

async function findById(id) {
  if (!toId(id)) return null;
  const result = await pool.query(`SELECT ${COLUMNS} FROM tasks WHERE id = $1`, [toId(id)]);
  return result.rows[0] ?? null;
}

async function create(title) {
  const result = await pool.query(
    `INSERT INTO tasks (title) VALUES ($1) RETURNING ${COLUMNS}`,
    [title]
  );
  return result.rows[0];
}

// Renvoie la tâche modifiée, ou null si elle n'existe pas.
// COALESCE($1, title) : si la nouvelle valeur est NULL, on garde l'ancienne.
async function update(id, changes) {
  if (!toId(id)) return null;
  const result = await pool.query(
    `UPDATE tasks
        SET title = COALESCE($1, title),
            done  = COALESCE($2, done)
      WHERE id = $3
      RETURNING ${COLUMNS}`,
    [changes.title ?? null, changes.done ?? null, toId(id)]
  );
  return result.rows[0] ?? null;
}

// Renvoie true si une tâche a été supprimée, false sinon
async function remove(id) {
  if (!toId(id)) return false;
  const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [toId(id)]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
