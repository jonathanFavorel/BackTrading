const Trade = require("../models/Trade");
const Currency = require("../models/Currency");
const TradingAccount = require("../models/TradingAccount");
const { updateTradingAccountStats } = require("../utils/statsUtils");

const calculateProfit = (
  entryPrice,
  exitPrice,
  quantity,
  contractSize,
  tickSize,
  exchangeRate = 1
) => {
  if (exitPrice === undefined) return 0;

  const positionSize = contractSize * quantity;
  const pipValue = (positionSize * tickSize) / exchangeRate;
  const tpPips = (exitPrice - entryPrice) / tickSize;
  const profit = pipValue * tpPips;

  return profit.toFixed(2);
};

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

    const currencyData = await Currency.findById(currency);
    const contractSize = currencyData.contractSize || 1;
    const tickSize = currencyData.tickSize || 0.0001; // Utiliser 0.0001 comme tickSize par défaut si non spécifié

    const tradingAccountData = await TradingAccount.findById(tradingAccount);
    const leverage = tradingAccountData.leverage || 1;

    const profit = calculateProfit(
      entryPrice,
      exitPrice,
      quantity,
      contractSize,
      tickSize
    );

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
      profit: parseFloat(profit), // Stocker en tant que nombre avec deux chiffres après la virgule
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

    const currencyData = await Currency.findById(currency);
    const contractSize = currencyData.contractSize || 1;
    const tickSize = currencyData.tickSize || 0.0001; // Utiliser 0.0001 comme tickSize par défaut si non spécifié

    const tradingAccountData = await TradingAccount.findById(tradingAccount);
    const leverage = tradingAccountData.leverage || 1;

    updatedFields.profit = parseFloat(
      calculateProfit(entryPrice, exitPrice, quantity, contractSize, tickSize)
    );

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

    await Trade.findByIdAndDelete(req.params.id);

    // Mettre à jour les statistiques du compte de trading
    await updateTradingAccountStats(trade.tradingAccount);

    res.json({ msg: "Trade removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTrades = async (req, res) => {
  try {
    const tradingAccounts = await TradingAccount.find({ user: req.user.id });
    const accountIds = tradingAccounts.map((account) => account._id);

    const trades = await Trade.find({
      tradingAccount: { $in: accountIds },
    }).populate("currency");
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
