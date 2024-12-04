const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addEnemy,
  getEnemies,
  getEnemiesByUserId,
  deleteEnemy,
  deleteEnemyByUserId,
} = require("../controllers/enemyController");

router.post("/add", auth, addEnemy);
router.get("/", auth, getEnemies);
router.get("/user/:userId", auth, getEnemiesByUserId); // Nouvelle route pour voir les ennemis par ID utilisateur
router.delete("/:id", auth, deleteEnemy); // Nouvelle route pour supprimer un ennemi
router.delete("/user/:userId", auth, deleteEnemyByUserId); // Nouvelle route pour supprimer un ennemi par ID utilisateur

module.exports = router;
