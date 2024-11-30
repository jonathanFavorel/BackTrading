const Trade = require("../models/Trade");

exports.createTrade = async (req, res) => {
  const {
    tradingAccount,
    currencyPair,
    entryPrice,
    exitPrice,
    takeProfit,
    stopLoss,
    quantity,
    status,
    entryDate,
    exitDate,
    tradeType,
  } = req.body;

  try {
    // Vérification des champs requis
    const missingFields = [];
    if (!tradingAccount) missingFields.push("tradingAccount");
    if (!currencyPair) missingFields.push("currencyPair");
    if (entryPrice === undefined) missingFields.push("entryPrice");
    if (quantity === undefined) missingFields.push("quantity");
    if (!status) missingFields.push("status");
    if (!entryDate) missingFields.push("entryDate");
    if (!tradeType) missingFields.push("tradeType");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ msg: "Please enter all required fields", missingFields });
    }

    const trade = new Trade({
      tradingAccount,
      currencyPair,
      entryPrice,
      exitPrice,
      takeProfit,
      stopLoss,
      quantity,
      status,
      entryDate,
      exitDate,
      tradeType,
    });
    await trade.save();
    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({
      tradingAccount: req.user.tradingAccount,
    });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
