const mongoose = require("mongoose");

const TradeStatsSchema = new mongoose.Schema({
  trade: { type: mongoose.Schema.Types.ObjectId, ref: "Trade", required: true },
  symbol: { type: String, required: true },
  totalTrades: { type: Number, default: 0 },
  totalVolume: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalLoss: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  averageWin: { type: Number, default: 0 },
  averageLoss: { type: Number, default: 0 },
  profitFactor: { type: Number, default: 0 },
  averageTrade: { type: Number, default: 0 },
  winningShortTrades: { type: Number, default: 0 },
  losingShortTrades: { type: Number, default: 0 },
  winningLongTrades: { type: Number, default: 0 },
  losingLongTrades: { type: Number, default: 0 },
  breakEvenTrades: { type: Number, default: 0 },
});

module.exports = mongoose.model("TradeStats", TradeStatsSchema);
