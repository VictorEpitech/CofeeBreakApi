const Charge = require("../models/Charge.model");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const charges = await Charge.find();
  res.json({ charges });
});

router.post("/", async (req, res) => {
  const { email } = req.body;
  let charge = await Charge.findOne({ email });
  if (charge) {
    res
      .status(500)
      .json({ status: "ko", message: "email is already registered" });
    return;
  }
  charge = await Charge.create({ email });
  res.status(201).json({ charge });
});

router.put("/:id", async (req, res) => {
  const { charges } = req.body;
  const charge = await Charge.findById(req.params.id);

  if (!charge) {
    res
      .status(500)
      .json({ status: "ko", message: "could not find requested record" });
    return;
  }
  charge.charges = charges;
  await charge.save();
  res.json({ charge });
});

module.exports = router;
