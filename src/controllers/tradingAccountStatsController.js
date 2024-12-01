const TradingAccountStats = require("../models/TradingAccountStats");

exports.createTradingAccountStats = async (tradingAccountId) => {
  try {
    const tradingAccountStats = new TradingAccountStats({
      tradingAccount: tradingAccountId,
      mostTradedPairs: [],
      mostProfitablePairs: [],
      leastProfitablePairs: [],
    });

    await tradingAccountStats.save();
  } catch (err) {
    console.error(err.message);
  }
};

exports.getTradingAccountStats = async (req, res) => {
  try {
    const stats = await TradingAccountStats.findOne({
      tradingAccount: req.params.id,
    });
    if (!stats) {
      return res.status(404).json({ msg: "Stats not found" });
    }
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
