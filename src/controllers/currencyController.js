const Currency = require("../models/Currency");

// Fonction pour créer une devise
exports.createCurrency = async (req, res) => {
  const { name, symbol, contractSize, type } = req.body;

  // Vérification des champs obligatoires
  if (!name || !symbol || !contractSize || !type) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

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

  // Vérification des critères de recherche
  if (!id && !symbol && !name && !type) {
    return res
      .status(400)
      .json({ msg: "Please provide at least one search criteria" });
  }

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

// Fonction pour rechercher une devise par catégorie
exports.getCurrencyByCategory = async (req, res) => {
  try {
    const currencies = await Currency.find({ type: req.params.type });
    if (currencies.length === 0) {
      return res
        .status(404)
        .json({ msg: "No currencies found for this category" });
    }
    res.json(currencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Fonction pour rechercher une devise par symbole
exports.getCurrencyBySymbol = async (req, res) => {
  try {
    const currency = await Currency.findOne({ symbol: req.params.symbol });
    if (!currency) {
      return res.status(404).json({ msg: "Currency not found" });
    }
    res.json(currency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Fonction pour mettre à jour une devise
exports.updateCurrency = async (req, res) => {
  const { name, symbol, contractSize, type } = req.body;

  // Vérification des champs obligatoires
  if (!name || !symbol || !contractSize || !type) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  const updatedFields = { name, symbol, contractSize, type };

  try {
    let currency = await Currency.findById(req.params.id);

    if (!currency) {
      return res.status(404).json({ msg: "Currency not found" });
    }

    currency = await Currency.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(currency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
