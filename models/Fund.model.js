const { Schema, model } = require("mongoose");

const fundSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
  },
  payment_method: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
});

module.exports = model("Fund", fundSchema);
