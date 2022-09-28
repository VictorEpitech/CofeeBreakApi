const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  access_token: String,
  refresh_token: String,
});
module.exports = model("User", userSchema);
