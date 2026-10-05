/**
 * ===== ROUTES (tasks.routes.js) =====
 *
 * Associe chaque URL + méthode HTTP à une fonction du contrôleur.
 * Ce fichier est monté sur "/api/tasks" dans app.js, donc :
 *   router.get("/")    → GET /api/tasks
 *   router.put("/:id") → PUT /api/tasks/123   (req.params.id = "123")
 */

const express = require("express");
const controller = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
