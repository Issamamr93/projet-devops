-- ===== Création de la base de données =====
-- Ce script est exécuté automatiquement par PostgreSQL au PREMIER démarrage
-- du conteneur (quand le volume de données est encore vide).

CREATE TABLE IF NOT EXISTS tasks (
  id         SERIAL PRIMARY KEY,                    -- identifiant auto-incrémenté (1, 2, 3...)
  title      VARCHAR(100) NOT NULL,                 -- 100 caractères max, comme dans l'API
  done       BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()    -- date de création
);
