const { expressjwt: jwt } = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

module.exports = { isAuthenticated };
