const router = require("express").Router();
const Fund = require("../models/Fund.model");

router.get("/", async (req, res) => {
  let funds = await Fund.find({}, undefined, { sort: { date: -1 } });
  if (req.query.populate) {
    funds = await Fund.find({}, undefined, { sort: { date: -1 } }).populate(
      "payment_method"
    );
  }
  res.json({ funds });
});

router.post("/", async (req, res) => {
  const { date, amount, reason, payment_method } = req.body;
  let total = amount;
  const lastFund = await Fund.find({}, undefined, {
    sort: {
      date: -1,
    },
  });
  if (lastFund.length > 0) {
    total += lastFund[0].totalAmount;
  }
  const fund = await Fund.create({
    date,
    amount,
    reason,
    payment_method,
    totalAmount: total,
  });
  res.status(201).json({ fund });
});

router.delete("/:id", async (req, res) => {
  await Fund.findByIdAndDelete(req.params.id);
  res.json({ status: "ok" });
});

module.exports = router;
