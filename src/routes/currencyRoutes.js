const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createCurrency,
  getCurrencies,
  getCurrencyByCriteria,
  getCurrencyByCategory,
  getCurrencyBySymbol,
  updateCurrency, // Importer la fonction de mise à jour
} = require("../controllers/currencyController");

router.post("/create", auth, createCurrency);
router.get("/", auth, getCurrencies);
router.get("/search", auth, getCurrencyByCriteria); // Nouvelle route pour rechercher une paire de devises
router.get("/category/:type", auth, getCurrencyByCategory); // Route pour rechercher par catégorie
router.get("/symbol/:symbol", auth, getCurrencyBySymbol); // Route pour rechercher par symbole
router.put("/update/:id", auth, updateCurrency); // Route pour modifier une paire de devises

module.exports = router;
