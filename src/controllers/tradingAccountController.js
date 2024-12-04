const TradingAccount = require("../models/TradingAccount");
const TradingAccountStats = require("../models/TradingAccountStats");

exports.createTradingAccount = async (req, res) => {
  const { currency, leverage, isPropFirm, propFirm, amount } = req.body;
  try {
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
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      breakEvenTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      averageTrade: 0,
      rank: 0,
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
    const tradingAccounts = await TradingAccount.find({
      user: req.user.id,
    }).populate("user");
    const accountsWithStats = await Promise.all(
      tradingAccounts.map(async (account) => {
        const stats = await TradingAccountStats.findOne({
          tradingAccount: account._id,
        });
        return { account, stats };
      })
    );
    res.json(accountsWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradingAccountsByUserId = async (req, res) => {
  try {
    const tradingAccounts = await TradingAccount.find({
      user: req.params.userId,
    }).populate("user");
    const accountsWithStats = await Promise.all(
      tradingAccounts.map(async (account) => {
        const stats = await TradingAccountStats.findOne({
          tradingAccount: account._id,
        });
        return { account, stats };
      })
    );
    res.json(accountsWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradingAccountById = async (req, res) => {
  try {
    const account = await TradingAccount.findById(req.params.id).populate(
      "user"
    );

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const stats = await TradingAccountStats.findOne({
      tradingAccount: account._id,
    });

    res.json({ account, stats });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradingAccountByToken = async (req, res) => {
  try {
    const accounts = await TradingAccount.find({ user: req.user.id }).populate(
      "user"
    );

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ msg: "No trading accounts found" });
    }

    const accountsWithStats = await Promise.all(
      accounts.map(async (account) => {
        const stats = await TradingAccountStats.findOne({
          tradingAccount: account._id,
        });
        return { account, stats };
      })
    );

    res.json(accountsWithStats);
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

    await TradingAccountStats.findOneAndDelete({ tradingAccount: account._id });
    await TradingAccount.deleteOne({ _id: account._id });

    res.json({ msg: "Account and associated stats removed" });
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
    await TradingAccountStats.deleteMany({
      tradingAccount: { $in: accounts.map((account) => account._id) },
    });

    res.json({
      msg: "All accounts and associated stats removed for this user",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTradingAccountStats = async (req, res) => {
  try {
    const stats = await TradingAccountStats.findOne({
      tradingAccount: req.params.tradingAccountId,
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
