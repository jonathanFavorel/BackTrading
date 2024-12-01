const mongoose = require("mongoose");
const TradeStats = require("./TradeStats");
const TradingAccountStats = require("./TradingAccountStats");
const Currency = require("./Currency");

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
  tradeType: { type: String, required: true },
});

// Hook pour mettre à jour les statistiques après la création d'un trade
TradeSchema.post("save", async function (doc, next) {
  await updateTradeStats(doc);
  next();
});

// Hook pour mettre à jour les statistiques après la mise à jour d'un trade
TradeSchema.post("findOneAndUpdate", async function (doc, next) {
  await updateTradeStats(doc);
  next();
});

// Hook pour mettre à jour les statistiques après la suppression d'un trade
TradeSchema.post("findOneAndRemove", async function (doc, next) {
  await updateTradeStats(doc);
  next();
});

// Fonction pour mettre à jour les statistiques des trades et du compte de trading
const updateTradeStats = async (trade) => {
  try {
    const currency = await Currency.findById(trade.currency);
    const symbol = currency ? currency.symbol : "Unknown";

    const stats = await TradeStats.findOne({ trade: trade._id });

    const profit = trade.exitPrice
      ? (trade.exitPrice - trade.entryPrice) * trade.quantity
      : 0;
    const loss = trade.exitPrice
      ? (trade.entryPrice - trade.exitPrice) * trade.quantity
      : 0;

    if (!stats) {
      const newStats = new TradeStats({
        trade: trade._id,
        symbol: symbol,
        totalTrades: 1,
        totalVolume: trade.quantity,
        totalProfit: profit > 0 ? profit : 0,
        totalLoss: loss > 0 ? loss : 0,
        winRate: trade.status === "TakeProfit" ? 100 : 0,
      });
      await newStats.save();
    } else {
      stats.totalTrades += 1;
      stats.totalVolume += trade.quantity;
      stats.totalProfit += profit > 0 ? profit : 0;
      stats.totalLoss += loss > 0 ? loss : 0;
      const winningTrades = await mongoose.model("Trade").countDocuments({
        tradingAccount: trade.tradingAccount,
        status: "TakeProfit",
      });
      stats.winRate = (winningTrades / stats.totalTrades) * 100;
      await stats.save();
    }

    // Mettre à jour les statistiques du compte de trading
    await updateTradingAccountStats(trade.tradingAccount);
  } catch (err) {
    console.error(err.message);
  }
};

// Fonction pour mettre à jour les statistiques du compte de trading
const updateTradingAccountStats = async (tradingAccountId) => {
  try {
    const trades = await mongoose
      .model("Trade")
      .find({ tradingAccount: tradingAccountId })
      .populate("currency");

    const stats = {
      totalTrades: trades.length,
      winningTrades: 0,
      losingTrades: 0,
      breakEvenTrades: 0,
      totalVolume: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      averageTrade: 0,
      rank: 0,
      mostTradedPairs: {},
      mostProfitablePairs: {},
      leastProfitablePairs: {},
    };

    trades.forEach((trade) => {
      const profit = trade.exitPrice
        ? (trade.exitPrice - trade.entryPrice) * trade.quantity
        : 0;
      const loss = trade.exitPrice
        ? (trade.entryPrice - trade.exitPrice) * trade.quantity
        : 0;

      stats.totalVolume += trade.quantity;
      stats.totalProfit += profit > 0 ? profit : 0;
      stats.totalLoss += loss > 0 ? loss : 0;

      if (profit > 0) {
        stats.winningTrades += 1;
      } else if (loss > 0) {
        stats.losingTrades += 1;
      } else if (trade.status === "BreakEven") {
        stats.breakEvenTrades += 1;
      }

      const pair = trade.currency.symbol;
      if (!stats.mostTradedPairs[pair]) {
        stats.mostTradedPairs[pair] = { count: 0, profit: 0, loss: 0 };
      }
      stats.mostTradedPairs[pair].count += 1;
      stats.mostTradedPairs[pair].profit += profit;
      stats.mostTradedPairs[pair].loss += loss;
    });

    stats.netProfit = stats.totalProfit - stats.totalLoss;
    stats.winRate = (stats.winningTrades / stats.totalTrades) * 100;
    stats.averageWin =
      stats.winningTrades > 0 ? stats.totalProfit / stats.winningTrades : 0;
    stats.averageLoss =
      stats.losingTrades > 0 ? stats.totalLoss / stats.losingTrades : 0;
    stats.profitFactor =
      stats.totalLoss > 0 ? stats.totalProfit / stats.totalLoss : 0;
    stats.averageTrade =
      stats.totalTrades > 0 ? stats.netProfit / stats.totalTrades : 0;

    // Trier et sélectionner les paires les plus échangées, les plus profitables et les moins profitables
    const mostTradedPairs = Object.entries(stats.mostTradedPairs)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([symbol, data]) => ({ symbol, count: data.count }));

    const mostProfitablePairs = Object.entries(stats.mostTradedPairs)
      .map(([symbol, data]) => ({
        symbol,
        profit: data.profit,
        count: data.count,
      }))
      .filter((pair) => pair.profit > 0)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 3);

    const leastProfitablePairs = Object.entries(stats.mostTradedPairs)
      .map(([symbol, data]) => ({
        symbol,
        loss: data.loss,
        count: data.count,
      }))
      .filter((pair) => pair.loss > 0)
      .sort((a, b) => a.loss - b.loss)
      .slice(0, 3);

    stats.mostTradedPairs = mostTradedPairs;
    stats.mostProfitablePairs = mostProfitablePairs;
    stats.leastProfitablePairs = leastProfitablePairs;

    await TradingAccountStats.findOneAndUpdate(
      { tradingAccount: tradingAccountId },
      stats,
      { upsert: true }
    );
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = mongoose.model("Trade", TradeSchema);
