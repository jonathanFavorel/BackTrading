const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createTradingAccount,
  getTradingAccounts,
  getTradingAccountsByUserId,
  getTradingAccountStats,
  getTradingAccountById,
  updateTradingAccount,
  deleteTradingAccount,
  deleteTradingAccountsByUserId,
} = require("../controllers/tradingAccountController");

router.post("/create", auth, createTradingAccount);
router.get("/", auth, getTradingAccounts);
router.get("/user/:userId", auth, getTradingAccountsByUserId);
router.get("/stats/:id", auth, getTradingAccountStats);
router.get("/:id", auth, getTradingAccountById);
router.put("/:id", auth, updateTradingAccount);
router.delete("/:id", auth, deleteTradingAccount);
router.delete("/user/:userId", auth, deleteTradingAccountsByUserId);

module.exports = router;
