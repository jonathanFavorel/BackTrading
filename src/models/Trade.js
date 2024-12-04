const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  tradingAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TradingAccount",
    required: true,
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
    required: true,
  },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  takeProfit: { type: Number },
  stopLoss: { type: Number },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["en cours", "StopLoss", "BreakEven", "TakeProfit"],
    required: true,
  },
  entryDate: { type: Date, required: true },
  tradeType: { type: String, required: true, enum: ["short", "long", "hold"] },
  exitDate: { type: Date },
  profit: { type: Number, default: 0 }, // Nouveau champ pour le profit
});

module.exports = mongoose.model("Trade", TradeSchema);
