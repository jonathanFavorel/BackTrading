const WebSocket = require("ws");
const axios = require("axios");

// Jeton JWT pour l'utilisateur 1
const tokenUser1 = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ZjQwZTkxMDY1YTZjNDBkNDc4NjA4In0sImlhdCI6MTczMzMxOTc0MiwiZXhwIjoxNzMzMzIzMzQyfQ.3JDaqAmCnBw9elBpIxKDttcXH7w2HZGYvr2AuZHb_oo"; // Remplacez par votre jeton JWT pour l'utilisateur 1

// ID de l'utilisateur 1
const userId1 = "674f40e91065a6c40d478608"; // Remplacez par l'ID de l'utilisateur 1
const userId2 = "6750122d8786ed93791b40a2"; // Remplacez par l'ID de l'utilisateur 2

// URL du serveur WebSocket
const wsUser1 = new WebSocket("ws://localhost:4000", {
  headers: {
    Authorization: tokenUser1,
  },
});

wsUser1.on("open", async () => {
  console.log("User 1 connected to WebSocket server");

  // Vérifier si les utilisateurs sont amis
  try {
    const response = await axios.get(`http://localhost:3000/api/friends`, {
      headers: {
        Authorization: tokenUser1,
      },
    });

    const friends = response.data;
    const areFriends = friends.some((friend) => friend.friend_id === userId2);

    if (!areFriends) {
      console.error("Users are not friends");
      wsUser1.close();
      return;
    }

    // Simuler la connexion de l'utilisateur 1
    wsUser1.send(
      JSON.stringify({
        event: "user_connected",
        userId: userId1,
      })
    );

    // Envoyer un message de l'utilisateur 1 à l'utilisateur 2 après 2 secondes
    setTimeout(() => {
      console.log("User 1 is sending a message to User 2");
      wsUser1.send(
        JSON.stringify({
          event: "send_message",
          senderId: userId1,
          receiverId: userId2,
          message: "Hello from User 1!",
        })
      );
    }, 2000);
  } catch (error) {
    console.error("Error checking friends for User 1:", error.message);
    wsUser1.close();
  }
});

wsUser1.on("message", (data) => {
  const message = JSON.parse(data);
  if (message.event === "user_status" && message.status === "online") {
    console.log(`User ${message.userId === userId1 ? "1" : "2"} online`);
  }
});

wsUser1.on("close", () => {
  console.log("User 1 disconnected from WebSocket server");
});

wsUser1.on("error", (error) => {
  console.error(`User 1 WebSocket error: ${error.message}`);
});