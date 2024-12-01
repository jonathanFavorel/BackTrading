const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
} = require("../controllers/tradeController");

router.post("/create", auth, createTrade);
router.get("/", auth, getTrades);
router.get("/:id", auth, getTradeById);
router.put("/:id", auth, updateTrade);
router.delete("/:id", auth, deleteTrade);

module.exports = router;
