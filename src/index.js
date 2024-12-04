const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const tradingAccountRoutes = require("./routes/tradingAccountRoutes");
const propFirmRoutes = require("./routes/propFirmRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const friendRoutes = require("./routes/friendRoutes");
const enemyRoutes = require("./routes/enemyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const initDB = require("./initDB");
const initPropFirms = require("./initPropFirms");

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB().then(async () => {
  // Initialiser les données après la connexion à la base de données
  await initDB();
  await initPropFirms();
});

// Configure body-parser
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

app.use(express.json({ extended: false }));

app.use("/api/users", userRoutes);
app.use("/api/tradingaccounts", tradingAccountRoutes);
app.use("/api/propfirms", propFirmRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/enemies", enemyRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));