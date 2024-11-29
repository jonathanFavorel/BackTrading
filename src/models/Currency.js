const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  contractSize: { type: Number, required: true },
  type: { type: String, required: true, enum: ['commodities', 'crypto', 'indice', 'forex', 'action'] },
});

module.exports = mongoose.model('Currency', CurrencySchema);