const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createTradingAccount,
  getTradingAccounts,
  getTradingAccountsByUserId,
  getTradingAccountStats,
  getTradingAccountById,
  getTradingAccountByToken,
  updateTradingAccount,
  deleteTradingAccount,
  deleteTradingAccountsByUserId,
} = require("../controllers/tradingAccountController");

router.post("/create", auth, createTradingAccount);
router.get("/", auth, getTradingAccounts);
router.get("/user/:userId", auth, getTradingAccountsByUserId); // Correction: obtenir les comptes de trading d'un utilisateur spécifique
router.get("/stats/:id", auth, getTradingAccountStats);
router.get("/:id", auth, getTradingAccountById);
router.get("/user/account", auth, getTradingAccountByToken); // Nouvelle route pour récupérer un compte de trading avec le token de l'utilisateur
router.put("/:id", auth, updateTradingAccount);
router.delete("/:id", auth, deleteTradingAccount); // Correction: supprimer un compte de trading et ses statistiques
router.delete("/user/:userId", auth, deleteTradingAccountsByUserId);

module.exports = router;
