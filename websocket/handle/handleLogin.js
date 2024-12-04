const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogin = async (data, ws) => {
  const { email, password } = data;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return ws.send(
        JSON.stringify({ event: "login_error", msg: "Invalid Credentials" })
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ws.send(
        JSON.stringify({ event: "login_error", msg: "Invalid Credentials" })
      );
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      async (err, token) => {
        if (err) throw err;

        // Mettre à jour l'état en ligne de l'utilisateur
        user.isOnline = true;
        await user.save();

        ws.send(JSON.stringify({ event: "login_success", token }));
      }
    );
  } catch (err) {
    console.error(err.message);
    ws.send(JSON.stringify({ event: "server_error", msg: "Server error" }));
  }
};

module.exports = handleLogin;
