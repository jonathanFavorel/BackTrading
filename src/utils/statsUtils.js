const mongoose = require("mongoose");
const TradingAccountStats = require("../models/TradingAccountStats");
const Trade = require("../models/Trade");

const updateTradingAccountStats = async (tradingAccountId) => {
  try {
    const trades = await Trade.find({
      tradingAccount: tradingAccountId,
    }).populate("currency");

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

module.exports = {
  updateTradingAccountStats,
};
