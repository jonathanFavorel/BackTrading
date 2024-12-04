const PropFirm = require("../models/PropFirm");

exports.createPropFirm = async (req, res) => {
  const { name, logoUrl } = req.body;

  try {
    const newPropFirm = new PropFirm({
      name,
      logoUrl,
    });

    const propFirm = await newPropFirm.save();
    res.json(propFirm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPropFirms = async (req, res) => {
  try {
    const propFirms = await PropFirm.find();
    res.json(propFirms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPropFirmById = async (req, res) => {
  try {
    const propFirm = await PropFirm.findById(req.params.id);

    if (!propFirm) {
      return res.status(404).json({ msg: "Prop firm not found" });
    }

    res.json(propFirm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updatePropFirm = async (req, res) => {
  const { name, logoUrl } = req.body;

  const updatedFields = {
    name,
    logoUrl,
  };

  try {
    let propFirm = await PropFirm.findById(req.params.id);

    if (!propFirm) {
      return res.status(404).json({ msg: "Prop firm not found" });
    }

    propFirm = await PropFirm.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(propFirm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deletePropFirm = async (req, res) => {
  try {
    const propFirm = await PropFirm.findById(req.params.id);

    if (!propFirm) {
      return res.status(404).json({ msg: "Prop firm not found" });
    }

    await propFirm.deleteOne();

    res.json({ msg: "Prop firm removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
