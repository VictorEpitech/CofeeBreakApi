const { default: axios } = require("axios");
const User = require("../models/User.model");
const Charge = require("../models/Charge.model");
const router = require("express").Router();

router.get("/:cardSerial", async (req, res) => {
  const loggedUser = await User.findById(req.auth._id);

  const charge = await Charge.findOne({ serial: req.params.cardSerial });
  if (charge) {
    res.json({ charge });
    return;
  }
  if (!charge && loggedUser.access_token) {
    try {
      const data = await axios.get(
        `${process.env.CARD_API}/card/${req.params.cardSerial}`,
        {
          headers: {
            authorization: `Bearer ${loggedUser.access_token}`,
          },
        }
      );
      let foundCharge = await Charge.findOne({ email: data.data.login });
      if (!foundCharge) {
        foundCharge = await Charge.create({
          email: data.data.login,
          serial: req.params.cardSerial,
        });
      } else {
        foundCharge.serial = req.params.cardSerial;
        await foundCharge.save();
      }
      res.json({ charge: foundCharge });
    } catch (error) {
      res
        .status(500)
        .json({ status: "ko", message: "please link your account again" });
    }
  } else if (!loggedUser.access_token) {
    res.status(500).json({
      status: "ko",
      message:
        "please link your account to microsoft in order to use this endpoint",
    });
    return;
  }
});

module.exports = router;
