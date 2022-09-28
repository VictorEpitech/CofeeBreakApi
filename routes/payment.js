const router = require("express").Router();
const Payment = require("../models/Payment.model");

router.get("/", async (req, res) => {
  const payments = await Payment.find();
  res.json({ payments });
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  let payment = await Payment.findOne({ name });
  if (payment) {
    res
      .status(500)
      .json({ status: "ko", message: "payment method already exists" });
    return;
  }
  payment = await Payment.create({ name });
  res.json({ payment });
});

module.exports = router;
