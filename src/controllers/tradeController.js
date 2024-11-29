const Trade = require('../models/Trade');

exports.createTrade = async (req, res) => {
  const { tradingAccounts, currency, entryPrice, exitPrice, takeProfit, quantity, status, entryDate, exitDate } = req.body;
  try {
    // Vérification des champs requis
    if (!tradingAccounts || !currency || !entryPrice || !quantity || !status || !entryDate) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const trade = new Trade({
      tradingAccounts,
      currency,
      entryPrice,
      exitPrice,
      takeProfit,
      quantity,
      status,
      entryDate,
      exitDate,
    });
    await trade.save();
    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ tradingAccounts: { $in: req.user.tradingAccounts } });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};