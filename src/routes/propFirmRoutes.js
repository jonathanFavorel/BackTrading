const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createPropFirm,
  getPropFirms,
  getPropFirmById,
  updatePropFirm,
  deletePropFirm,
} = require("../controllers/propFirmController");

router.post("/create", auth, createPropFirm);
router.get("/", auth, getPropFirms);
router.get("/:id", auth, getPropFirmById);
router.put("/:id", auth, updatePropFirm);
router.delete("/:id", auth, deletePropFirm);

module.exports = router;
