const PropFirm = require("./models/PropFirm");

const propFirms = [
  {
    name: "FTMO",
    logoUrl: "https://example.com/logos/ftmo.png",
  },
  {
    name: "Topstep",
    logoUrl: "https://example.com/logos/topstep.png",
  },
  {
    name: "The5ers",
    logoUrl: "https://example.com/logos/the5ers.png",
  },
  {
    name: "My Forex Funds",
    logoUrl: "https://example.com/logos/myforexfunds.png",
  },
  {
    name: "Earn2Trade",
    logoUrl: "https://example.com/logos/earn2trade.png",
  },
  {
    name: "OneUp Trader",
    logoUrl: "https://example.com/logos/oneuptrader.png",
  },
  {
    name: "Fidelcrest",
    logoUrl: "https://example.com/logos/fidelcrest.png",
  },
  {
    name: "City Traders Imperium",
    logoUrl: "https://example.com/logos/citytradersimperium.png",
  },
  {
    name: "BluFx",
    logoUrl: "https://example.com/logos/blufx.png",
  },
  {
    name: "Lux Trading Firm",
    logoUrl: "https://example.com/logos/luxtradingfirm.png",
  },
  {
    name: "Funding Talent",
    logoUrl: "https://example.com/logos/fundingtalent.png",
  },
  {
    name: "The Funded Trader",
    logoUrl: "https://example.com/logos/thefundedtrader.png",
  },
  {
    name: "SurgeTrader",
    logoUrl: "https://example.com/logos/surgetrader.png",
  },
  {
    name: "Traders Central",
    logoUrl: "https://example.com/logos/traderscentral.png",
  },
  {
    name: "FTUK",
    logoUrl: "https://example.com/logos/ftuk.png",
  },
  {
    name: "Alpha Capital Group",
    logoUrl: "https://example.com/logos/alphacapitalgroup.png",
  },
  {
    name: "FundedNext",
    logoUrl: "https://example.com/logos/fundednext.png",
  },
  {
    name: "The Trading Pit",
    logoUrl: "https://example.com/logos/thetradingpit.png",
  },
  {
    name: "True Forex Funds",
    logoUrl: "https://example.com/logos/trueforexfunds.png",
  },
  {
    name: "Funded Trading Plus",
    logoUrl: "https://example.com/logos/fundedtradingplus.png",
  },
  {
    name: "The Prop Trading",
    logoUrl: "https://example.com/logos/theproptrading.png",
  },
  {
    name: "Next Step Funded",
    logoUrl: "https://example.com/logos/nextstepfunded.png",
  },
];

const initPropFirms = async () => {
  try {
    await PropFirm.deleteMany({});
    await PropFirm.insertMany(propFirms);
    console.log("Database initialized with prop firms.");
  } catch (err) {
    console.error("Error initializing database with prop firms:", err);
  }
};

module.exports = initPropFirms;
