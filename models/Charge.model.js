const { Schema, model } = require("mongoose");

const chargesSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  charges: {
    type: Number,
    default: 0,
  },
  serial: {
    type: String,
    unique: true,
  },
});

module.exports = model("Schema", chargesSchema);
