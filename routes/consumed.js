const Consumption = require("../models/Consumption");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const consumed = await Consumption.find({}, null, { sort: { date: -1 } });
  res.json({ consumed });
});

router.post("/", async (req, res) => {
  const { date, consumedItems, email } = req.body;
  const consumed = await Consumption.create({ date, consumedItems, email });
  res.status(201).json({ consumed });
});

module.exports = router;
