const User = require("../../src/models/User");

const handleGetUserProfile = async (data, ws) => {
  try {
    const user = await User.findById(data.userId).select("-password");
    ws.send(JSON.stringify({ event: "user_profile", user }));
  } catch (err) {
    console.error(err.message);
    ws.send(JSON.stringify({ event: "server_error", msg: "Server error" }));
  }
};

module.exports = handleGetUserProfile;
