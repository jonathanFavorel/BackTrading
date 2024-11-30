const TradingAccount = require("../models/TradingAccount");
const TradingAccountStats = require("../models/TradingAccountStats");

exports.createTradingAccount = async (req, res) => {
  const { currency, leverage, isPropFirm, propFirm, amount } = req.body;
  try {
    // Vérification des champs requis
    if (!currency || !leverage || !amount) {
      return res.status(400).json({ msg: "Please enter all required fields" });
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
    res.status(500).send("Server error");
  }
};

exports.getTradingAccounts = async (req, res) => {
  try {
    const tradingAccounts = await TradingAccount.find({ user: req.user.id });
    res.json(tradingAccounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradingAccountsByUserId = async (req, res) => {
  try {
    const tradingAccounts = await TradingAccount.find({
      user: req.params.userId,
    });
    res.json(tradingAccounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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

exports.getTradingAccountById = async (req, res) => {
  try {
    const account = await TradingAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateTradingAccount = async (req, res) => {
  const { currency, leverage, isPropFirm, propFirm, amount } = req.body;

  const updatedFields = {
    currency,
    leverage,
    isPropFirm,
    propFirm,
    amount,
  };

  try {
    let account = await TradingAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    account = await TradingAccount.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTradingAccount = async (req, res) => {
  try {
    const account = await TradingAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await account.remove();

    res.json({ msg: "Account removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTradingAccountsByUserId = async (req, res) => {
  try {
    const accounts = await TradingAccount.find({ user: req.params.userId });

    if (accounts.length === 0) {
      return res.status(404).json({ msg: "No accounts found for this user" });
    }

    await TradingAccount.deleteMany({ user: req.params.userId });

    res.json({ msg: "All accounts removed for this user" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
