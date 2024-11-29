const Enemy = require('../models/Enemy');

exports.addEnemy = async (req, res) => {
  const { enemy_id } = req.body;
  try {
    // Vérification des champs requis
    if (!enemy_id) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const enemy = new Enemy({
      user_id: req.user.id,
      enemy_id,
    });
    await enemy.save();
    res.json(enemy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getEnemies = async (req, res) => {
  try {
    const enemies = await Enemy.find({ user_id: req.user.id });
    res.json(enemies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};