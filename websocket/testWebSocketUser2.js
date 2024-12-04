const WebSocket = require("ws");

// Jeton JWT pour l'utilisateur 2
const tokenUser2 =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1MDEyMmQ4Nzg2ZWQ5Mzc5MWI0MGEyIn0sImlhdCI6MTczMzMzODEyNywiZXhwIjoxNzMzMzQxNzI3fQ.6Z3cdi3yTsIXyLoRkV5bwI-uXAjeHhIU7VZEpENXmtU"; // Remplacez par votre jeton JWT pour l'utilisateur 2

// ID de l'utilisateur 2
const userId2 = "6750122d8786ed93791b40a2"; // Remplacez par l'ID de l'utilisateur 2

// URL du serveur WebSocket
const wsUser2 = new WebSocket("ws://localhost:4000", {
  headers: {
    Authorization: tokenUser2,
  },
});

wsUser2.on("open", () => {
  console.log("User 2 connected to WebSocket server");

  // Envoyer l'événement user_connected
  wsUser2.send(
    JSON.stringify({
      event: "user_connected",
      userId: userId2,
    })
  );

  // Attendre une minute avant de vérifier les messages non lus
  setTimeout(() => {
    console.log("User 2 checking unread messages");
    wsUser2.send(
      JSON.stringify({
        event: "get_unread_messages",
        userId: userId2,
      })
    );
  }, 60000); // 60000 ms = 1 minute
});

wsUser2.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("Received message:", message);

  if (message.event === "unread_messages") {
    // Filtrer les messages non lus
    const unreadMessages = message.messages.filter(
      (msg) => msg.seenAt === null
    );
    console.log("Unread messages:", unreadMessages);

    // Marquer les messages comme vus
    setTimeout(() => {
      unreadMessages.forEach((msg) => {
        wsUser2.send(
          JSON.stringify({
            event: "mark_as_seen",
            messageId: msg._id,
            userId: userId2,
          })
        );
      });
    }, 60000); // Marquer les messages comme vus après 1 minute
  }
});

wsUser2.on("close", () => {
  console.log("User 2 disconnected from WebSocket server");
});

wsUser2.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});
