const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  getUserByCriteria,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.get("/search", auth, getUserByCriteria); // Nouvelle route pour rechercher un utilisateur par critères

module.exports = router;
