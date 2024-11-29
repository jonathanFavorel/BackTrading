const PropFirm = require('../models/PropFirm');

exports.createPropFirm = async (req, res) => {
  const { name, logoUrl } = req.body;
  try {
    // Vérification des champs requis
    if (!name || !logoUrl) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const propFirm = new PropFirm({ name, logoUrl });
    await propFirm.save();
    res.json(propFirm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPropFirms = async (req, res) => {
  try {
    const propFirms = await PropFirm.find();
    res.json(propFirms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};