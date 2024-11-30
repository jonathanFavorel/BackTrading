const mongoose = require("mongoose");
const TradingAccountStats = require("./TradingAccountStats");
const Currency = require("./Currency");

const TradeSchema = new mongoose.Schema({
  tradingAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TradingAccount",
    required: true,
  },
  currencyPair: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
    required: true,
  },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  takeProfit: { type: Number },
  stopLoss: { type: Number },
  quantity: { type: Number, required: true },
  status: { type: String, required: true },
  entryDate: { type: Date, required: true },
  tradeType: { type: String, required: true, enum: ["short", "long", "hold"] },
  exitDate: { type: Date },
});

// Middleware post-save pour mettre à jour les statistiques
TradeSchema.post("save", async function (doc, next) {
  try {
    const stats = await TradingAccountStats.findOne({
      tradingAccount: doc.tradingAccount,
    });
    const currencyPair = await Currency.findById(doc.currencyPair);

    if (!currencyPair) {
      const error = new Error("Currency pair not found");
      error.status = 404;
      return next(error);
    }

    let profitOrLoss;
    if (doc.tradeType === "short") {
      profitOrLoss = (doc.entryPrice - doc.exitPrice) * doc.quantity;
    } else {
      profitOrLoss = (doc.exitPrice - doc.entryPrice) * doc.quantity;
    }

    const isWinningTrade = profitOrLoss > 0;
    const isLosingTrade = profitOrLoss < 0;
    const isBreakEvenTrade = profitOrLoss === 0;

    if (!stats) {
      // Créer un nouveau document de statistiques si inexistant
      const newStats = new TradingAccountStats({
        tradingAccount: doc.tradingAccount,
        totalTrades: 1,
        winningTrades: isWinningTrade ? 1 : 0,
        losingTrades: isLosingTrade ? 1 : 0,
        breakEvenTrades: isBreakEvenTrade ? 1 : 0,
        totalProfit: isWinningTrade ? profitOrLoss : 0,
        totalLoss: isLosingTrade ? -profitOrLoss : 0,
        netProfit: profitOrLoss,
        winRate: isWinningTrade ? 100 : 0,
        averageWin: isWinningTrade ? profitOrLoss : 0,
        averageLoss: isLosingTrade ? -profitOrLoss : 0,
        profitFactor: isWinningTrade ? profitOrLoss : 0,
        averageTrade: profitOrLoss,
        mostTradedPairs: [
          {
            symbol: currencyPair.symbol,
            name: currencyPair.name,
            id: currencyPair._id,
            type: currencyPair.type,
            count: 1,
          },
        ],
        mostProfitablePairs: isWinningTrade
          ? [
              {
                symbol: currencyPair.symbol,
                name: currencyPair.name,
                id: currencyPair._id,
                type: currencyPair.type,
                profit: profitOrLoss,
              },
            ]
          : [],
        leastProfitablePairs: isLosingTrade
          ? [
              {
                symbol: currencyPair.symbol,
                name: currencyPair.name,
                id: currencyPair._id,
                type: currencyPair.type,
                loss: -profitOrLoss,
              },
            ]
          : [],
        winningShortTrades: doc.tradeType === "short" && isWinningTrade ? 1 : 0,
        losingShortTrades: doc.tradeType === "short" && isLosingTrade ? 1 : 0,
        winningLongTrades: doc.tradeType === "long" && isWinningTrade ? 1 : 0,
        losingLongTrades: doc.tradeType === "long" && isLosingTrade ? 1 : 0,
      });
      await newStats.save();
    } else {
      // Mettre à jour les statistiques existantes
      stats.totalTrades += 1;
      if (isWinningTrade) {
        stats.winningTrades += 1;
        stats.totalProfit += profitOrLoss;
        if (doc.tradeType === "short") {
          stats.winningShortTrades += 1;
        } else if (doc.tradeType === "long") {
          stats.winningLongTrades += 1;
        }
        const profitablePair = stats.mostProfitablePairs.find(
          (pair) => pair.symbol === currencyPair.symbol
        );
        if (profitablePair) {
          profitablePair.profit += profitOrLoss;
        } else {
          stats.mostProfitablePairs.push({
            symbol: currencyPair.symbol,
            name: currencyPair.name,
            id: currencyPair._id,
            type: currencyPair.type,
            profit: profitOrLoss,
          });
        }
      } else if (isLosingTrade) {
        stats.losingTrades += 1;
        stats.totalLoss += -profitOrLoss;
        if (doc.tradeType === "short") {
          stats.losingShortTrades += 1;
        } else if (doc.tradeType === "long") {
          stats.losingLongTrades += 1;
        }
        const profitablePair = stats.mostProfitablePairs.find(
          (pair) => pair.symbol === currencyPair.symbol
        );
        if (profitablePair) {
          profitablePair.profit += profitOrLoss;
        } else {
          stats.mostProfitablePairs.push({
            symbol: currencyPair.symbol,
            name: currencyPair.name,
            id: currencyPair._id,
            type: currencyPair.type,
            profit: profitOrLoss,
          });
        }
      } else {
        stats.breakEvenTrades += 1;
      }
      stats.netProfit = stats.totalProfit - stats.totalLoss;
      stats.winRate = (stats.winningTrades / stats.totalTrades) * 100;
      stats.averageWin =
        stats.winningTrades > 0 ? stats.totalProfit / stats.winningTrades : 0;
      stats.averageLoss =
        stats.losingTrades > 0 ? stats.totalLoss / stats.losingTrades : 0;
      stats.profitFactor =
        stats.totalLoss > 0
          ? stats.totalProfit / stats.totalLoss
          : stats.totalProfit;
      stats.averageTrade =
        stats.totalTrades > 0 ? stats.netProfit / stats.totalTrades : 0;

      const tradedPair = stats.mostTradedPairs.find(
        (pair) => pair.symbol === currencyPair.symbol
      );
      if (tradedPair) {
        tradedPair.count += 1;
      } else {
        stats.mostTradedPairs.push({
          symbol: currencyPair.symbol,
          name: currencyPair.name,
          id: currencyPair._id,
          type: currencyPair.type,
          count: 1,
        });
      }

      // Limiter les paires les plus tradées à 5
      stats.mostTradedPairs = stats.mostTradedPairs
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Limiter les paires les plus profitables à 3
      stats.mostProfitablePairs = stats.mostProfitablePairs
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 3);

      await stats.save();
    }
    next();
  } catch (err) {
    console.error("Error updating trading account stats:", err);
    const error = new Error("Server error");
    error.status = 500;
    next(error);
  }
});

module.exports = mongoose.model("Trade", TradeSchema);
