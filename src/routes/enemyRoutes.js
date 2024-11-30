const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addEnemy, getEnemies } = require("../controllers/enemyController");

router.post("/add", auth, addEnemy);
router.get("/", auth, getEnemies);

module.exports = router;
