const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User.model");
const { isAuthenticated } = require("../utils/middleware");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.json({ status: "ko", message: "user already exists" });
    return;
  }
  const pwd = await bcrypt.hash(password, 12);
  user = await User.create({ email, password: pwd });
  res.json({ status: "ok", message: "user created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    res.status(500).json({ status: "ko", message: "user not found" });
    return;
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(500).json({ status: "ko", message: "wrong credentials" });
  }
  if (user.access_token) {
    const params = new URLSearchParams();
    params.append("client_id", process.env.AZURE_CLIENT_ID);
    params.append(
      "scope",
      "offline_access https://graph.microsoft.com/user.read"
    );
    params.append("refresh_token", user.refresh_token);
    params.append("grant_type", "refresh_token");
    params.append("client_secret", process.env.AZURE_CLIENT_SECRET);
    try {
      const ares = await axios.default.post(
        "https://login.microsoftonline.com/organizations/oauth2/v2.0/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      user.access_token = ares.data.access_token;
      user.refresh_token = ares.data.refresh_token;
    } catch (err) {
      user.access_token = null;
      user.refresh_token = null;
    }
    await user.save();
  }
  const token = jwt.sign({ ...user.toObject() }, process.env.SECRET, {
    algorithm: "HS256",
  });
  res.json({ status: "ok", token, user });
});

router.get("/verify", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.auth._id);
  res.json(user);
});

router.get("/link", isAuthenticated, (req, res) => {
  res.json({
    url: `https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?
    client_id=${process.env.AZURE_CLIENT_ID}
    &response_type=code
    &redirect_uri=${encodeURIComponent(
      `${process.env.BASE_URL}/auth/link/callback`
    )}
    &response_mode=query
    &scope=offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fuser.read
    &state=${req.auth._id}`,
  });
});

router.get("/link/callback", async (req, res) => {
  const { code, state } = req.query;
  const params = new URLSearchParams();
  params.append("client_id", process.env.AZURE_CLIENT_ID);
  params.append(
    "scope",
    "offline_access https://graph.microsoft.com/user.read"
  );
  params.append("code", code);
  params.append("redirect_uri", `${process.env.BASE_URL}/auth/link/callback`);
  params.append("grant_type", "authorization_code");
  params.append("client_secret", process.env.AZURE_CLIENT_SECRET);
  try {
    const ares = await axios.default.post(
      "https://login.microsoftonline.com/organizations/oauth2/v2.0/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const user = await User.findById(state);
    if (user) {
      user.access_token = ares.data.access_token;
      user.refresh_token = ares.data.refresh_token;
      await user.save();
      res.render("callback", {
        app_url: process.env.APP_URL,
        token: jwt.sign({ ...user.toObject() }, process.env.SECRET, {
          algorithm: "HS256",
        }),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
