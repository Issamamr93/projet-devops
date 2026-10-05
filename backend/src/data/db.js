/**
 * ===== CONNEXION À LA BASE DE DONNÉES (db.js) =====
 *
 * Un "pool" garde quelques connexions à PostgreSQL ouvertes et les
 * réutilise, au lieu d'en ouvrir une nouvelle à chaque requête (plus rapide).
 *
 * Les paramètres viennent des variables d'environnement (définies dans
 * docker-compose.yml). Les valeurs par défaut servent en local sans Docker.
 */

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "taches",
  password: process.env.DB_PASSWORD || "taches",
  database: process.env.DB_NAME || "taches",
});

module.exports = pool;
