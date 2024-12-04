const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const handleGetUserProfile = require("./handle/handleGetUserProfile");
const handleSendMessage = require("./handle/handleSendMessage");
const {
  handleUserConnection,
  handleGetUnreadMessages,
} = require("./handle/handleUserConnection");
const handleUserDisconnection = require("./handle/handleUserDisconnection");
const handleMarkAsSeen = require("./handle/handleMarkAsSeen");
const handleEditMessage = require("./handle/handleEditMessage");

dotenv.config();

const startWebSocketServer = () => {
  const server = http.createServer();
  const wss = new WebSocket.Server({ server });

  connectDB();

  // Store connected users
  const connectedUsers = new Map();

  // Middleware pour vérifier le jeton JWT
  wss.on("connection", (ws, req) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("Authentication error: No token provided");
      ws.close(1008, "Authentication error");
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Authentication error: Invalid token");
        ws.close(1008, "Authentication error");
        return;
      }
      ws.userId = decoded.user.id;
      console.log("New client connected");

      // Handle user connection
      ws.on("message", async (message) => {
        const data = JSON.parse(message);
        switch (data.event) {
          case "user_connected":
            await handleUserConnection(data, ws, connectedUsers, wss);
            break;
          case "send_message":
            await handleSendMessage(data, connectedUsers);
            break;
          case "get_user_profile":
            await handleGetUserProfile(data, ws);
            break;
          case "mark_as_seen":
            await handleMarkAsSeen(data, ws, connectedUsers);
            break;
          case "get_unread_messages":
            await handleGetUnreadMessages(data, ws);
            break;
          case "edit_message":
            await handleEditMessage(data, ws, connectedUsers);
            break;
          default:
            console.error("Unknown event:", data.event);
        }
      });

      // Handle user disconnection
      ws.on("close", () => {
        handleUserDisconnection(ws, connectedUsers, wss);
      });
    });
  });

  const PORT = process.env.WS_PORT || 4000;
  server.listen(PORT, () =>
    console.log(`WebSocket server started on port ${PORT}`)
  );
};

startWebSocketServer();
