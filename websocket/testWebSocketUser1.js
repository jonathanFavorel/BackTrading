const WebSocket = require("ws");

// Jeton JWT pour l'utilisateur 1
const tokenUser1 =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ZjQwZTkxMDY1YTZjNDBkNDc4NjA4In0sImlhdCI6MTczMzMzODExMCwiZXhwIjoxNzMzMzQxNzEwfQ.haVVDGBel49VIQMMICwEElcBL8QuUcyJg9OYBwvXBx0"; // Remplacez par votre jeton JWT pour l'utilisateur 1

// ID de l'utilisateur 1
const userId1 = "674f40e91065a6c40d478608"; // Remplacez par l'ID de l'utilisateur 1

// URL du serveur WebSocket
const wsUser1 = new WebSocket("ws://localhost:4000", {
  headers: {
    Authorization: tokenUser1,
  },
});

wsUser1.on("open", () => {
  console.log("User 1 connected to WebSocket server");

  // Envoyer l'événement user_connected
  wsUser1.send(
    JSON.stringify({
      event: "user_connected",
      userId: userId1,
    })
  );

  // Envoyer un message à l'utilisateur 2
  setTimeout(() => {
    wsUser1.send(
      JSON.stringify({
        event: "send_message",
        senderId: userId1,
        receiverId: "6750122d8786ed93791b40a2", // Remplacez par l'ID de l'utilisateur 2
        message: "Hello from User 1!",
      })
    );
  }, 2000); // Envoyer le message après 2 secondes
});

wsUser1.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("Received message:", message);

  if (message.event === "message_seen") {
    console.log("User 2 has seen the message:", message.message);
  }

  if (message.event === "message_edited") {
    console.log("Message edited:", message.message);
  }
});

wsUser1.on("close", () => {
  console.log("User 1 disconnected from WebSocket server");
});

wsUser1.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});
