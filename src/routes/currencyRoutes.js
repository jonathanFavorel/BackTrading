const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createCurrency,
  getCurrencies,
  getCurrencyByCriteria,
} = require("../controllers/currencyController");

router.post("/create", auth, createCurrency);
router.get("/", auth, getCurrencies);
router.get("/search", auth, getCurrencyByCriteria); // Nouvelle route pour rechercher une paire de devises

module.exports = router;
