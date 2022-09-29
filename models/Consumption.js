const { Schema, model } = require("mongoose");

const consumeSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  consumedItems: {
    type: Number,
    required: true,
  },
});

module.exports = model("Consume", consumeSchema);
