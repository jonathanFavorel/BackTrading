const Trade = require("../models/Trade");
const { updateTradingAccountStats } = require("../utils/statsUtils");

exports.createTrade = async (req, res) => {
  const {
    tradingAccount,
    currency,
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
    if (!currency) missingFields.push("currency");
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
      currency,
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

    // Mettre à jour les statistiques du compte de trading
    await updateTradingAccountStats(tradingAccount);

    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).populate("currency");
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id).populate("currency");

    if (!trade) {
      return res.status(404).json({ msg: "Trade not found" });
    }

    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateTrade = async (req, res) => {
  const {
    tradingAccount,
    currency,
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

  const updatedFields = {
    tradingAccount,
    currency,
    entryPrice,
    exitPrice,
    takeProfit,
    stopLoss,
    quantity,
    status,
    entryDate,
    exitDate,
    tradeType,
  };

  try {
    let trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ msg: "Trade not found" });
    }

    trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    // Mettre à jour les statistiques du compte de trading
    await updateTradingAccountStats(tradingAccount);

    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ msg: "Trade not found" });
    }

    await trade.remove();

    // Mettre à jour les statistiques du compte de trading
    await updateTradingAccountStats(trade.tradingAccount);

    res.json({ msg: "Trade removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
