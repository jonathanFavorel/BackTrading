const Currency = require('../models/Currency');

exports.createCurrency = async (req, res) => {
  const { name, symbol, contractSize, type } = req.body;
  try {
    // Vérification des champs requis
    if (!name || !symbol || !contractSize || !type) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const currency = new Currency({ name, symbol, contractSize, type });
    await currency.save();
    res.json(currency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};