const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

exports.register = async (req, res) => {
  const {
    nametag,
    firstName,
    lastName,
    email,
    phoneNumber,
    profilePicture, // base64 image
    password,
    dateOfBirth,
    bio,
    isAdmin,
  } = req.body;

  try {
    // Vérification des champs requis
    if (
      !nametag ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !dateOfBirth
    ) {
      return res.status(400).json({ msg: "Please enter all required fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      nametag,
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      bio,
      isAdmin,
    });

    if (profilePicture) {
      const buffer = Buffer.from(profilePicture, "base64");
      if (buffer.length > MAX_IMAGE_SIZE) {
        return res.status(400).json({ msg: "Image size exceeds 1MB" });
      }
      user.profilePicture = profilePicture;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
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
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber, bio, profilePicture } = req.body;

  const updatedFields = {
    firstName,
    lastName,
    phoneNumber,
    bio,
    profilePicture,
  };

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserByCriteria = async (req, res) => {
  const { id, email, surname, name } = req.query;

  // Vérification des critères de recherche
  if (!id && !email && !surname && !name) {
    return res
      .status(400)
      .json({ msg: "Please provide at least one search criteria" });
  }

  try {
    let query = {};
    if (id) query._id = id;
    if (email) query.email = email;
    if (surname) query.lastName = surname;
    if (name) query.firstName = name;

    const user = await User.findOne(query).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
