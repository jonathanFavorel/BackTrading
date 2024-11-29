const TradingAccount = require('../models/TradingAccount');
const TradingAccountStats = require('../models/TradingAccountStats');

exports.createTradingAccount = async (req, res) => {
  const { currency, leverage, isPropFirm, propFirm, amount } = req.body;
  try {
    // Vérification des champs requis
    if (!currency || !leverage || !amount) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const tradingAccount = new TradingAccount({
      user: req.user.id,
      currency,
      leverage,
      isPropFirm,
      propFirm,
      amount,
    });
    await tradingAccount.save();

    const tradingAccountStats = new TradingAccountStats({
      tradingAccount: tradingAccount.id,
      mostTradedPairs: [],
      mostProfitablePairs: [],
      leastProfitablePairs: [],
    });

    await tradingAccountStats.save();

    res.json(tradingAccount);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTradingAccounts = async (req, res) => {
  try {
    const tradingAccounts = await TradingAccount.find({ user: req.user.id });
    res.json(tradingAccounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTradingAccountStats = async (req, res) => {
  try {
    const stats = await TradingAccountStats.findOne({ tradingAccount: req.params.id });
    if (!stats) {
      return res.status(404).json({ msg: 'Stats not found' });
    }
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};