const Currency = require("./models/Currency");

const currencies = [
  {
    name: "US Dollar",
    symbol: "USD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro",
    symbol: "EUR",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "British Pound",
    symbol: "GBP",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Japanese Yen",
    symbol: "JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Swiss Franc",
    symbol: "CHF",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Canadian Dollar",
    symbol: "CAD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Australian Dollar",
    symbol: "AUD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "New Zealand Dollar",
    symbol: "NZD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro/US Dollar",
    symbol: "EUR/USD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "US Dollar/Japanese Yen",
    symbol: "USD/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "British Pound/US Dollar",
    symbol: "GBP/USD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Australian Dollar/US Dollar",
    symbol: "AUD/USD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "US Dollar/Swiss Franc",
    symbol: "USD/CHF",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "US Dollar/Canadian Dollar",
    symbol: "USD/CAD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro/British Pound",
    symbol: "EUR/GBP",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro/Japanese Yen",
    symbol: "EUR/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro/Swiss Franc",
    symbol: "EUR/CHF",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "British Pound/Japanese Yen",
    symbol: "GBP/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "British Pound/Swiss Franc",
    symbol: "GBP/CHF",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Australian Dollar/Japanese Yen",
    symbol: "AUD/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Canadian Dollar/Japanese Yen",
    symbol: "CAD/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Swiss Franc/Japanese Yen",
    symbol: "CHF/JPY",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "New Zealand Dollar/US Dollar",
    symbol: "NZD/USD",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "US Dollar/South African Rand",
    symbol: "USD/ZAR",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Euro/South African Rand",
    symbol: "EUR/ZAR",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "British Pound/South African Rand",
    symbol: "GBP/ZAR",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Australian Dollar/South African Rand",
    symbol: "AUD/ZAR",
    contractSize: 100000,
    type: "forex",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    contractSize: 1,
    type: "crypto",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    contractSize: 1,
    type: "crypto",
  },
  {
    name: "Ripple",
    symbol: "XRP",
    contractSize: 1000,
    type: "crypto",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    contractSize: 1,
    type: "crypto",
  },
  {
    name: "Gold",
    symbol: "XAU",
    contractSize: 100,
    type: "commodities",
  },
  {
    name: "Silver",
    symbol: "XAG",
    contractSize: 5000,
    type: "commodities",
  },
  {
    name: "Crude Oil",
    symbol: "CL",
    contractSize: 1000,
    type: "commodities",
  },
  {
    name: "Natural Gas",
    symbol: "NG",
    contractSize: 10000,
    type: "commodities",
  },
  {
    name: "S&P 500",
    symbol: "SPX",
    contractSize: 50,
    type: "indice",
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    contractSize: 10,
    type: "indice",
  },
  {
    name: "Nasdaq 100",
    symbol: "NDX",
    contractSize: 20,
    type: "indice",
  },
  {
    name: "FTSE 100",
    symbol: "FTSE",
    contractSize: 10,
    type: "indice",
  },
  {
    name: "DAX 30",
    symbol: "DAX",
    contractSize: 25,
    type: "indice",
  },
  {
    name: "Nikkei 225",
    symbol: "N225",
    contractSize: 5,
    type: "indice",
  },
  {
    name: "Apple Inc.",
    symbol: "AAPL",
    contractSize: 1,
    type: "action",
  },
  {
    name: "Microsoft Corporation",
    symbol: "MSFT",
    contractSize: 1,
    type: "action",
  },
  {
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    contractSize: 1,
    type: "action",
  },
  {
    name: "Facebook Inc.",
    symbol: "FB",
    contractSize: 1,
    type: "action",
  },
  {
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    contractSize: 1,
    type: "action",
  },
  {
    name: "Tesla Inc.",
    symbol: "TSLA",
    contractSize: 1,
    type: "action",
  },
];

const initDB = async () => {
  try {
    await Currency.deleteMany({});
    await Currency.insertMany(currencies);
    console.log("Database initialized with currencies.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports = initDB;
initDB();
