const Currency = require("../models/Currency");

// Fonction pour créer une devise
exports.createCurrency = async (req, res) => {
  const { name, symbol, contractSize, type } = req.body;
  try {
    const currency = new Currency({ name, symbol, contractSize, type });
    await currency.save();
    res.json(currency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Fonction pour obtenir toutes les devises
exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Nouvelle fonction pour rechercher une devise par différents critères
exports.getCurrencyByCriteria = async (req, res) => {
  const { id, symbol, name, type } = req.query;
  try {
    let query = {};
    if (id) query._id = id;
    if (symbol) query.symbol = symbol;
    if (name) query.name = name;
    if (type) query.type = type;

    const currency = await Currency.findOne(query);
    if (!currency) {
      return res.status(404).json({ msg: "Currency not found" });
    }
    res.json(currency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
