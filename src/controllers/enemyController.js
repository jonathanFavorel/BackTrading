const Enemy = require("../models/Enemy");

exports.addEnemy = async (req, res) => {
  const { enemy_id } = req.body;
  try {
    // Vérification des champs requis
    if (!enemy_id) {
      return res.status(400).json({ msg: "Please enter all required fields" });
    }

    // Vérifier si l'utilisateur est déjà dans la liste des ennemis
    let enemy = await Enemy.findOne({
      user_id: req.user.id,
      enemy_id,
    });

    if (enemy) {
      if (enemy.status === "blocked") {
        return res.status(400).json({ msg: "User is already blocked" });
      } else {
        // Mettre à jour le statut à "blocked" si le statut n'est pas "blocked"
        enemy.status = "blocked";
        enemy.blockedAt = new Date();
        await enemy.save();
        return res.json(enemy);
      }
    }

    // Ajouter un nouvel ennemi
    enemy = new Enemy({
      user_id: req.user.id,
      enemy_id,
      status: "blocked",
      blockedAt: new Date(),
    });
    await enemy.save();
    res.json(enemy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getEnemies = async (req, res) => {
  try {
    const enemies = await Enemy.find({ user_id: req.user.id });
    res.json(enemies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getEnemiesByUserId = async (req, res) => {
  try {
    const enemies = await Enemy.find({ user_id: req.params.userId });
    if (!enemies || enemies.length === 0) {
      return res.status(404).json({ msg: "No enemies found for this user" });
    }
    res.json(enemies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteEnemy = async (req, res) => {
  try {
    const enemy = await Enemy.findById(req.params.id);

    if (!enemy) {
      return res.status(404).json({ msg: "Enemy not found" });
    }

    await Enemy.findByIdAndDelete(req.params.id);

    res.json({ msg: "Enemy removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteEnemyByUserId = async (req, res) => {
  try {
    const enemy = await Enemy.findOne({
      user_id: req.user.id,
      enemy_id: req.params.userId,
    });

    if (!enemy) {
      return res.status(404).json({ msg: "Enemy not found" });
    }

    await Enemy.findByIdAndDelete(enemy._id);

    res.json({ msg: "Enemy removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
