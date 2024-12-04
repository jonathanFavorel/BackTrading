const WebSocket = require("ws");
const axios = require("axios");

// Jeton JWT pour l'utilisateur 2
const tokenUser2 = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1MDEyMmQ4Nzg2ZWQ5Mzc5MWI0MGEyIn0sImlhdCI6MTczMzMxOTcwNCwiZXhwIjoxNzMzMzIzMzA0fQ.OWULZ_3HmcEgetgqs9mLhIscylA2R1_WV14S41srfdU"; // Remplacez par votre jeton JWT pour l'utilisateur 2

// ID de l'utilisateur 2
const userId1 = "674f40e91065a6c40d478608"; // Remplacez par l'ID de l'utilisateur 1
const userId2 = "6750122d8786ed93791b40a2"; // Remplacez par l'ID de l'utilisateur 2

// URL du serveur WebSocket
const wsUser2 = new WebSocket("ws://localhost:4000", {
  headers: {
    Authorization: tokenUser2,
  },
});

wsUser2.on("open", async () => {
  console.log("User 2 connected to WebSocket server");

  // Vérifier si les utilisateurs sont amis
  try {
    const response = await axios.get(`http://localhost:3000/api/friends`, {
      headers: {
        Authorization: tokenUser2,
      },
    });

    const friends = response.data;
    const areFriends = friends.some((friend) => friend.friend_id === userId1);

    if (!areFriends) {
      console.error("Users are not friends");
      wsUser2.close();
      return;
    }

    // Simuler la connexion de l'utilisateur 2
    wsUser2.send(
      JSON.stringify({
        event: "user_connected",
        userId: userId2,
      })
    );
  } catch (error) {
    console.error("Error checking friends for User 2:", error.message);
    wsUser2.close();
  }
});

wsUser2.on("message", (data) => {
  const message = JSON.parse(data);
  if (message.event === "user_status" && message.status === "online") {
    console.log(`User ${message.userId === userId1 ? "1" : "2"} online`);
  }

  if (message.event === "receive_message" && message.message.sender === userId1) {
    console.log(`User 2 received message from User 1: ${message.message.content}`);
  }
});

wsUser2.on("close", () => {
  console.log("User 2 disconnected from WebSocket server");
});

wsUser2.on("error", (error) => {
  console.error(`User 2 WebSocket error: ${error.message}`);
});